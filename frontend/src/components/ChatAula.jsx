import React, { useState } from "react";
import { Send, WifiOff, Smile } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import { useChatAula } from "./../hooks/useChatAula";
import Avatar from "./common/Avatar";

const ChatAula = ({ cursoId, usuarioNombre }) => {
    const { 
        messages, input, setInput, isConnected, scrollRef, sendMessage 
    } = useChatAula(cursoId, usuarioNombre);
    
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const onEmojiClick = (emojiData) => {
        setInput(prev => prev + emojiData.emoji);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(e);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden relative">
            {/* Header del Chat */}
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between z-10">
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
                    const messageKey = msg.id || `${msg.remitente}-${index}`;

                    return (
                        <div key={messageKey} className={`flex gap-3 ${esMio ? "flex-row-reverse" : "flex-row"}`}>
                            <div className="flex-shrink-0 mt-1">
                                <Avatar 
                                    src={msg.foto} 
                                    type="perfil" 
                                    className="w-8 h-8 rounded-full border-none shadow-sm" 
                                />
                            </div>

                            <div className={`flex flex-col ${esMio ? "items-end" : "items-start"} max-w-[75%]`}>
                                <div className="flex items-center gap-2 mb-1.5 px-1">
                                    {!esMio && (
                                        <span className="text-[9px] font-black uppercase text-indigo-500 truncate max-w-[100px]">
                                            {msg.remitente}
                                        </span>
                                    )}
                                    <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md border ${
                                        esDocente ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-blue-50 text-blue-600 border-blue-100"
                                    }`}>
                                        {esDocente ? 'Docente' : 'Alumno'}
                                    </span>
                                    {esMio && <span className="text-[9px] font-black uppercase text-slate-400">Tú</span>}
                                </div>

                                <div className={`p-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                                    esMio ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                                }`}>
                                    {/* whitespace-pre-wrap permite ver los saltos de línea enviados */}
                                    <p className="text-sm font-medium leading-tight break-words whitespace-pre-wrap">
                                        {msg.contenido}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Selector de Emojis */}
            {showEmojiPicker && (
                <div className="absolute bottom-24 left-4 z-50 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <EmojiPicker 
                        onEmojiClick={onEmojiClick} 
                        theme="light"
                        width={280}
                        height={350}
                        skinTonesDisabled
                    />
                </div>
            )}

            {/* Formulario de envío multilínea */}
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 items-end">
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2 mb-1 rounded-xl transition-all ${showEmojiPicker ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                    <Smile size={22} />
                </button>

                <textarea
                    rows="1"
                    disabled={!isConnected}
                    value={input}
                    onFocus={() => setShowEmojiPicker(false)}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none max-h-32 custom-scrollbar"
                />
                
                <button
                    type="submit"
                    disabled={!isConnected || !input.trim()}
                    className="p-3 mb-0.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all active:scale-90 disabled:opacity-30 shadow-lg"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatAula;