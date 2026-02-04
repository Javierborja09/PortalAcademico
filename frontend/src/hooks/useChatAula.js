import { useState, useEffect, useRef, useCallback } from "react";
import sesionService from "../services/sesionService";

export const useChatAula = (cursoId, usuarioNombre) => {
    const [messages, setMessages] = useState(() => sesionService.obtenerHistorial(cursoId));
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const scrollRef = useRef(null);

    // 1. Mejoramos el procesador para evitar duplicados exactos
    const handleIncomingMessage = useCallback((msg) => {
        if (msg.tipo === "CHAT") {
            setMessages((prev) => {
                // Verificamos si el último mensaje es idéntico para evitar el rebote del socket
                const ultimoMsg = prev[prev.length - 1];
                if (ultimoMsg && 
                    ultimoMsg.contenido === msg.contenido && 
                    ultimoMsg.remitente === msg.remitente &&
                    // Solo evitamos duplicados si ocurrieron hace menos de 2 segundos
                    (Date.now() - (ultimoMsg.timestamp || 0) < 2000)) {
                    return prev;
                }
                return [...prev, { ...msg, timestamp: Date.now() }];
            });
        }
    }, []);

    useEffect(() => {
        let subscription = null;
        let checkInterval = null;

        const subscribe = () => {
            const client = sesionService.client;
            if (client && client.connected) {
                setIsConnected(true);
                // IMPORTANTE: Nos aseguramos de desuscribir cualquier intento previo
                subscription = client.subscribe(`/topic/curso/${cursoId}`, (payload) => {
                    handleIncomingMessage(JSON.parse(payload.body));
                });
                return true;
            }
            return false;
        };

        if (!subscribe()) {
            checkInterval = setInterval(() => {
                if (subscribe()) {
                    clearInterval(checkInterval);
                }
            }, 1000);
        }
        return () => {
            if (subscription) subscription.unsubscribe();
            if (checkInterval) clearInterval(checkInterval);
        };
    }, [cursoId, handleIncomingMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && isConnected) {
            sesionService.enviarEvento(cursoId, {
                remitente: usuarioNombre,
                contenido: input,
                tipo: "CHAT",
                rol: localStorage.getItem('rol'),
                foto: localStorage.getItem('foto')
            });
            setInput("");
        }
    };

    return { messages, input, setInput, isConnected, scrollRef, sendMessage };
};