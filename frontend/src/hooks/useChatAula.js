import { useState, useEffect, useRef, useCallback } from "react";
import sesionService from "../services/sesionService";

/**
 * Hook para gestionar la lógica del chat en tiempo real.
 * Maneja suscripciones STOMP, historial en memoria y auto-scroll.
 */
export const useChatAula = (cursoId, usuarioNombre) => {
    const [messages, setMessages] = useState(() => sesionService.obtenerHistorial(cursoId));
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const scrollRef = useRef(null);

    // Función para procesar nuevos mensajes
    const handleIncomingMessage = useCallback((msg) => {
        if (msg.tipo === "CHAT") {
            setMessages((prev) => [...prev, msg]);
        }
    }, []);

    useEffect(() => {
        const client = sesionService.client;

        if (client && client.connected) {
            setIsConnected(true);
            const subscription = client.subscribe(`/topic/curso/${cursoId}`, (payload) => {
                handleIncomingMessage(JSON.parse(payload.body));
            });
            return () => subscription.unsubscribe();
        } else {
            // Reintento de conexión si el cliente no está listo
            const checkInterval = setInterval(() => {
                if (sesionService.client?.connected) {
                    setIsConnected(true);
                    setMessages(sesionService.obtenerHistorial(cursoId));
                    clearInterval(checkInterval);
                }
            }, 1000);
            return () => clearInterval(checkInterval);
        }
    }, [cursoId, handleIncomingMessage]);

    // Auto-scroll al recibir mensajes
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
            });
            setInput("");
        }
    };

    return {
        messages,
        input,
        setInput,
        isConnected,
        scrollRef,
        sendMessage
    };
};