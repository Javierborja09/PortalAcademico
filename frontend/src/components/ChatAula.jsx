import React from "react";
import { Send, WifiOff, ShieldCheck, GraduationCap } from "lucide-react";
import { useChatAula } from "./../hooks/useChatAula";

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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
                {!isConnected && (
                    <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-[9px] uppercase bg-red-50 py-2 rounded-xl">
                        <WifiOff size={12} /> Reconectando...
                    </div>
                )}

                {messages.map((msg, index) => {
                    const esMio = msg.remitente === usuarioNombre;
                    const esDocente = msg.rol?.toLowerCase() === 'docente';

                    return (
                        <div key={index} className={`flex flex-col ${esMio ? "items-end" : "items-start"}`}>
                            {/* Nombre y Rol */}
                            <div className="flex items-center gap-2 mb-1 px-2">
                                {!esMio && (
                                    <span className="text-[9px] font-black uppercase text-indigo-500 truncate max-w-[100px]">
                                        {msg.remitente}
                                    </span>
                                )}
                                
                                {/* Etiqueta de Rol */}
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

                            {/* Burbuja de Mensaje */}
                            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                                esMio
                                    ? "bg-indigo-600 text-white rounded-tr-none"
                                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                            }`}>
                                <p className="text-sm font-medium leading-tight">{msg.contenido}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Formulario */}
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                <input
                    type="text"
                    disabled={!isConnected}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                    type="submit"
                    disabled={!isConnected || !input.trim()}
                    className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all active:scale-90"
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};

export default ChatAula;