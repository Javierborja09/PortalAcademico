import { useState, useEffect, useRef, useCallback } from "react";
import sesionService from "@/services/sesionService";

export const useChatAula = (cursoId, usuarioNombre) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const scrollRef = useRef(null);

    const handleIncomingMessage = useCallback((msg) => {
        if (msg.tipo === "CHAT") {
            setMessages((prev) => {
                const yaExiste = prev.some(m => 
                    m.contenido === msg.contenido && 
                    m.remitente === msg.remitente &&
                    Math.abs(Date.now() - (m.localTimestamp || 0)) < 2000
                );
                if (yaExiste) return prev;
                return [...prev, { ...msg, localTimestamp: Date.now() }];
            });
        }
    }, []);

    useEffect(() => {
        let subscription = null;

        const connect = () => {
            if (sesionService.client?.connected) {
                setIsConnected(true);
                subscription = sesionService.client.subscribe(`/topic/curso/${cursoId}`, (payload) => {
                    const msg = JSON.parse(payload.body);
                    
                    if (msg.tipo === "CHAT_HISTORY") {
                        setMessages(msg.lista);
                    } else {
                        handleIncomingMessage(msg);
                    }
                });

                // Pedimos el historial al servidor apenas conectamos
                sesionService.client.publish({ destination: `/app/sesion.historial/${cursoId}` });
            }
        };

        connect();
        return () => subscription?.unsubscribe();
    }, [cursoId, handleIncomingMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        if (e) e.preventDefault();
        if (input.trim() && isConnected) {
            const nuevoEvento = {
                remitente: usuarioNombre,
                contenido: input,
                tipo: "CHAT",
                rol: localStorage.getItem('rol'),
                foto: localStorage.getItem('foto')
            };
            sesionService.enviarEvento(cursoId, nuevoEvento);
            setMessages(prev => [...prev, { ...nuevoEvento, localTimestamp: Date.now() }]);
            setInput("");
        }
    };

    return { messages, input, setInput, isConnected, scrollRef, sendMessage };
};