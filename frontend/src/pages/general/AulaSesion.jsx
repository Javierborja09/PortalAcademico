import React from 'react';
import { 
    MicOff, VideoOff, LogOut, Settings, Users, 
    MessageSquare, User, ShieldCheck, CheckCircle2, Loader2, X 
} from 'lucide-react';
import { useAulaSesion } from '@/hooks/useAulaSesion';
import ChatAula from '@/components/aula/ChatAula';
import AulaSesionParticipantes from '@/components/aula/AulaSesionParticipantes';

const AulaSesion = () => {
    const {
        id, curso, isValidating, showEndModal, notificacion, activeTab,
        setActiveTab, usuarioNombre, rol, toggleTab, handleTerminarSesion
    } = useAulaSesion();

    if (isValidating) return (
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="font-black uppercase tracking-widest text-xs">Sincronizando sesión...</p>
        </div>
    );

    return (
        <div className="h-screen bg-slate-950 flex flex-col overflow-hidden text-white relative">
            
            {/* TOAST NOTIFICATION */}
            {notificacion && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] animate-bounceIn">
                    <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-50">{notificacion}</p>
                    </div>
                </div>
            )}

            {/* MODAL FIN DE CLASE */}
            {showEndModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4">
                    <div className="bg-white p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-slideUp">
                        <CheckCircle2 size={50} className="text-emerald-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-slate-900 uppercase mb-2">Sesión Finalizada</h2>
                        <button onClick={() => window.location.href = `/aula-virtual/${id}`} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">
                            Volver al Aula
                        </button>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header className="px-6 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-xl"><ShieldCheck size={18} /></div>
                    <div className="text-left">
                        <h2 className="text-sm font-black uppercase tracking-widest leading-none text-white truncate max-w-[200px] md:max-w-md">
                            {curso?.nombreCurso || 'Cargando curso...'}
                        </h2>
                        <p className="text-[10px] text-blue-400 font-bold uppercase opacity-70">ID: {id}</p>
                    </div>
                </div>
                <button onClick={handleTerminarSesion} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-2xl transition-all font-black text-[10px] uppercase">
                    <LogOut size={14} /> <span>{rol === 'docente' ? 'Terminar Clase' : 'Salir'}</span>
                </button>
            </header>

            <main className="flex-1 flex overflow-hidden relative">
                {/* VIDEO AREA */}
                <div className={`flex-1 relative items-center justify-center p-8 transition-all duration-300 ${activeTab ? 'hidden md:flex' : 'flex'}`}>
                    <div className="w-full h-full max-w-6xl bg-slate-900 rounded-[3rem] border-2 border-white/5 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 mb-6">
                            <User size={60} className="text-slate-600" />
                        </div>
                        <p className="font-black uppercase text-[10px] tracking-[0.4em] text-slate-600">Esperando señal de video</p>
                        <div className="absolute bottom-8 left-8 bg-slate-900/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                            <p className="text-xs font-black uppercase text-white truncate">{usuarioNombre}</p>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR PANEL (CHAT / USERS) */}
                {activeTab && (
                    <aside className="fixed inset-0 z-[100] md:relative md:inset-auto w-full md:w-[380px] md:border-l border-white/5 bg-slate-950 flex flex-col animate-slideInRight">
                        <div className="flex items-center justify-between p-4 bg-slate-900 md:hidden">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white">{activeTab === 'chat' ? 'Chat' : 'Asistencia'}</h3>
                            <button onClick={() => setActiveTab(null)} className="p-2"><X size={20}/></button>
                        </div>
                        <div className="flex-1 overflow-hidden p-4">
                            {activeTab === 'chat' ? <ChatAula cursoId={id} usuarioNombre={usuarioNombre} /> : <AulaSesionParticipantes cursoId={id} />}
                        </div>
                    </aside>
                )}
            </main>

            {/* CONTROLES */}
            <footer className="px-8 py-6 bg-slate-950 border-t border-white/5 flex justify-center items-center gap-6 z-50">
                <div className="flex gap-3 bg-slate-900/50 p-2 rounded-[2rem] border border-white/5">
                    <button className="p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 active:scale-90 transition-all"><MicOff size={20} /></button>
                    <button className="p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 active:scale-90 transition-all"><VideoOff size={20} /></button>
                </div>
                <div className="flex gap-3 bg-slate-900/50 p-2 rounded-[2rem] border border-white/5">
                    <button onClick={() => toggleTab('users')} className={`p-4 rounded-2xl transition-all ${activeTab === 'users' ? 'bg-white text-slate-900' : 'text-slate-400 hover:bg-white/5'}`}><Users size={20} /></button>
                    <button onClick={() => toggleTab('chat')} className={`p-4 rounded-2xl transition-all ${activeTab === 'chat' ? 'bg-white text-slate-900' : 'text-slate-400 hover:bg-white/5'}`}><MessageSquare size={20} /></button>
                </div>
            </footer>
        </div>
    );
};

export default AulaSesion;