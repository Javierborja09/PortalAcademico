import React, { useState, useEffect, useRef } from 'react';
import { Send, WifiOff } from 'lucide-react';
import sesionService from './../services/sesionService';

const ChatAula = ({ cursoId, usuarioNombre }) => {
    // 🚩 Inicializamos el estado directamente con el historial guardado en el servicio
    const [messages, setMessages] = useState(() => sesionService.obtenerHistorial(cursoId));
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const client = sesionService.client;

        const handleIncomingMessage = (msg) => {
            // Solo procesamos mensajes de tipo CHAT
            if (msg.tipo === 'CHAT') {
                // Actualizamos el estado local para la vista actual
                setMessages((prev) => [...prev, msg]);
            }
        };

        if (client && client.connected) {
            setIsConnected(true);
            
            // Suscribirse al tópico del curso
            const subscription = client.subscribe(`/topic/curso/${cursoId}`, (payload) => {
                handleIncomingMessage(JSON.parse(payload.body));
            });

            return () => {
                subscription.unsubscribe();
            };
        } else {
            // Reintento de conexión si el servicio no está listo
            const checkInterval = setInterval(() => {
                if (sesionService.client?.connected) {
                    setIsConnected(true);
                    // Al conectar tarde, recuperamos lo que el servicio haya captado en memoria
                    setMessages(sesionService.obtenerHistorial(cursoId));
                    clearInterval(checkInterval);
                }
            }, 1000);
            return () => clearInterval(checkInterval);
        }
    }, [cursoId]);

    // Auto-scroll al recibir mensajes nuevos o al abrir el chat
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && isConnected) {
            sesionService.enviarEvento(cursoId, {
                remitente: usuarioNombre,
                contenido: input,
                tipo: 'CHAT'
            });
            setInput("");
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
            {/* Header del Chat */}
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70">Chat de la sesión</h3>
                </div>
            </div>

            {/* Cuerpo de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                {!isConnected && (
                    <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-[9px] uppercase bg-red-50 py-2 rounded-xl">
                        <WifiOff size={12} /> Reconectando chat...
                    </div>
                )}
                
                {messages.length === 0 && isConnected && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                        <Send size={40} className="mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No hay mensajes</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.remitente === usuarioNombre ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                            msg.remitente === usuarioNombre 
                            ? 'bg-indigo-600 text-white rounded-tr-none text-right' 
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none text-left'
                        }`}>
                            {msg.remitente !== usuarioNombre && (
                                <p className="text-[9px] font-black uppercase text-indigo-500 mb-1 truncate">
                                    {msg.remitente}
                                </p>
                            )}
                            <p className="text-sm font-medium leading-tight">
                                {msg.contenido}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Formulario de Envío */}
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                <input 
                    type="text"
                    disabled={!isConnected}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
                <button 
                    type="submit" 
                    disabled={!isConnected || !input.trim()}
                    className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all active:scale-90 disabled:opacity-30"
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};

export default ChatAula;