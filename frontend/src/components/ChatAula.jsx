import React from "react";
import { Send, WifiOff } from "lucide-react";
import { useChatAula } from "./../hooks/useChatAula";
import Avatar from "./common/Avatar";

const ChatAula = ({ cursoId, usuarioNombre }) => {
    const { 
        messages, input, setInput, isConnected, scrollRef, sendMessage 
    } = useChatAula(cursoId, usuarioNombre);

    return (
        <div className="flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
            {/* Header del Chat */}
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70">Chat de la sesión</h3>
                </div>
            </div>

            {/* Cuerpo de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 custom-scrollbar">
                {!isConnected && (
                    <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-[9px] uppercase bg-red-50 py-2 rounded-xl">
                        <WifiOff size={12} /> Reconectando...
                    </div>
                )}

                {messages.length === 0 && isConnected && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                        <Send size={40} className="mb-2 text-slate-400" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No hay mensajes</p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const esMio = msg.remitente === usuarioNombre;
                    const esDocente = msg.rol?.toLowerCase() === 'docente';

                    return (
                        <div key={index} className={`flex gap-3 ${esMio ? "flex-row-reverse" : "flex-row"}`}>
                            {/* Avatar del Remitente */}
                            <div className="flex-shrink-0 mt-1">
                                <Avatar 
                                    src={msg.foto} 
                                    type="perfil" 
                                    className="w-8 h-8 rounded-full border-none shadow-sm" 
                                />
                            </div>

                            {/* Contenido del Mensaje */}
                            <div className={`flex flex-col ${esMio ? "items-end" : "items-start"} max-w-[75%]`}>
                                {/* Info del Remitente */}
                                <div className="flex items-center gap-2 mb-1.5 px-1">
                                    {!esMio && (
                                        <span className="text-[9px] font-black uppercase text-indigo-500 truncate max-w-[100px]">
                                            {msg.remitente}
                                        </span>
                                    )}
                                    
                                    <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md border ${
                                        esDocente 
                                            ? "bg-amber-50 text-amber-600 border-amber-200" 
                                            : "bg-blue-50 text-blue-600 border-blue-100"
                                    }`}>
                                        {esDocente ? 'Docente' : 'Alumno'}
                                    </span>

                                    {esMio && (
                                        <span className="text-[9px] font-black uppercase text-slate-400">Tú</span>
                                    )}
                                </div>

                                {/* Burbuja */}
                                <div className={`p-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                                    esMio
                                        ? "bg-indigo-600 text-white rounded-tr-none"
                                        : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                                }`}>
                                    <p className="text-sm font-medium leading-tight break-words">{msg.contenido}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Formulario de envío */}
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                <input
                    type="text"
                    disabled={!isConnected}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
                />
                <button
                    type="submit"
                    disabled={!isConnected || !input.trim()}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all active:scale-90 disabled:opacity-30 disabled:grayscale shadow-lg shadow-indigo-100"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatAula;