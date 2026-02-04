import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    MicOff, VideoOff, MonitorUp, LogOut, Settings, 
    Users, MessageSquare, User, ShieldCheck, CheckCircle2, Loader2, ArrowLeft, X
} from 'lucide-react';

import sesionService from '../../services/sesionService';
import ChatAula from '../../components/ChatAula';
import AulaSesionParticipantes from '../../components/AulaSesionParticipantes';

const AulaSesion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [isValidating, setIsValidating] = useState(true);
    const [showEndModal, setShowEndModal] = useState(false); 
    const [notificacion, setNotificacion] = useState(null);
    
    // Control de paneles laterales: 'chat', 'users' o null
    const [activeTab, setActiveTab] = useState(null); 

    const rol = localStorage.getItem('rol')?.toLowerCase();
    const nombre = localStorage.getItem('nombre') || 'Usuario';
    const apellido = localStorage.getItem('apellido') || '';
    const usuarioNombre = `${nombre} ${apellido}`.trim();

    useEffect(() => {
        // 1. Conexión y Listeners
        sesionService.conectar(id, (msg) => {
            // Notificaciones de entrada/salida (Toast)
            if (msg.tipo === "JOIN" || msg.tipo === "LEAVE") {
                setNotificacion(msg.contenido);
                setTimeout(() => setNotificacion(null), 2500);
            }
            
            // Fin de sesión disparado por el servidor
            if (msg.tipo === "END_SESSION") {
                setShowEndModal(true); 
                sesionService.limpiarDatosCurso(id);
            }

            // Validaciones para el alumno
            if (rol === 'alumno') {
                if (msg.tipo === "SESSION_IS_ACTIVE") {
                    setIsValidating(false);
                } else if (msg.tipo === "SESSION_IS_INACTIVE") {
                    navigate(`/aula-virtual/${id}`);
                }
            }
        }, () => {
            // Callback: Al conectar con éxito
            if (rol !== 'alumno') {
                setIsValidating(false);
            } else {
                sesionService.verificarEstado(id);
                setTimeout(() => {
                    setIsValidating(prev => {
                        if (prev) navigate(`/aula-virtual/${id}`);
                        return false;
                    });
                }, 4000);
            }

            // Avisar entrada con nombre completo y rol
            sesionService.enviarEvento(id, {
                remitente: usuarioNombre,
                tipo: 'JOIN',
                rol: rol,
                contenido: `${usuarioNombre} se ha unido a la clase`
            });
        });

        // 2. LIMPIEZA (Se ejecuta al cerrar el componente o la pestaña)
        return () => {
            // Avisar salida antes de apagar el cliente
            sesionService.enviarEvento(id, {
                remitente: usuarioNombre,
                tipo: 'LEAVE',
                contenido: `${usuarioNombre} ha salido de la clase`
            });
            
            sesionService.desconectar();
        };
    }, [id, navigate, rol, usuarioNombre]);

    const toggleTab = (tab) => {
        setActiveTab(activeTab === tab ? null : tab);
    };

    const handleTerminarSesion = () => {
        if (rol === 'docente' || rol === 'admin') {
            sesionService.finalizarClase(id, usuarioNombre);
        } else {
            navigate(`/aula-virtual/${id}`);
        }
    };

    if (isValidating) {
        return (
            <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">Sincronizando sesión...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-950 flex flex-col overflow-hidden text-white font-sans relative">
            
            {/* TOAST DE NOTIFICACIÓN */}
            {notificacion && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] pointer-events-none transition-all duration-500">
                    <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounceIn">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-50 italic">
                            {notificacion}
                        </p>
                    </div>
                </div>
            )}

            {/* MODAL FIN DE CLASE */}
            {showEndModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4">
                    <div className="bg-white p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-slideUp">
                        <CheckCircle2 size={50} className="text-emerald-500 mx-auto mb-6 animate-bounce" />
                        <h2 className="text-2xl font-black text-slate-900 uppercase mb-2">Sesión Finalizada</h2>
                        <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                            {rol === 'docente' ? 'Has cerrado la clase correctamente.' : 'El docente ha dado por terminada la clase.'}
                        </p>
                        <button onClick={() => navigate(`/aula-virtual/${id}`)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all">
                            Volver al Aula Virtual
                        </button>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header className="px-6 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
                        <ShieldCheck size={18} />
                    </div>
                    <div className="hidden xs:block text-left">
                        <h2 className="text-sm font-black uppercase tracking-widest leading-none mb-1 text-white">Clase en Vivo</h2>
                        <p className="text-[10px] text-blue-400 font-bold uppercase opacity-70 italic">ID: {id}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button onClick={handleTerminarSesion} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-2xl transition-all font-black text-[10px] uppercase border border-red-500/20 shadow-lg">
                        <LogOut size={14} /> 
                        <span>{rol === 'docente' ? 'Terminar Todo' : 'Salir'}</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                
                {/* ÁREA DE VIDEO - Se oculta en móvil si hay una pestaña abierta */}
                <div className={`flex-1 relative items-center justify-center p-4 md:p-8 transition-all duration-300 ${activeTab ? 'hidden md:flex' : 'flex'}`}>
                    <div className="w-full h-full max-w-6xl bg-slate-900 rounded-[3rem] border-2 border-white/5 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="flex flex-col items-center text-slate-700">
                            <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 shadow-2xl mb-6">
                                <User size={60} />
                            </div>
                            <p className="font-black uppercase text-[10px] tracking-[0.4em] opacity-40">Esperando señal de video</p>
                        </div>
                        <div className="absolute bottom-8 left-8 bg-slate-900/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-left">
                            <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Participante</p>
                            <p className="text-xs font-black uppercase text-white truncate max-w-[150px]">{usuarioNombre}</p>
                        </div>
                    </div>
                </div>

                {/* ASIDE DINÁMICO (Chat / Participantes) */}
                <aside className={`
                    ${activeTab ? 'flex' : 'hidden'} 
                    fixed inset-0 z-[100] md:relative md:inset-auto w-full md:w-[380px] 
                    md:border-l border-white/5 bg-slate-950 md:bg-transparent flex-col animate-slideInRight
                `}>
                    <div className="flex items-center justify-between p-4 bg-slate-900 md:hidden">
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">
                            {activeTab === 'chat' ? 'Chat de Clase' : 'Lista de Asistencia'}
                        </h3>
                        <button onClick={() => setActiveTab(null)} className="p-2 bg-white/5 rounded-lg text-white">
                            <X size={20}/>
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden p-4">
                        {activeTab === 'chat' ? (
                            <ChatAula cursoId={id} usuarioNombre={usuarioNombre} />
                        ) : (
                            <AulaSesionParticipantes cursoId={id} />
                        )}
                    </div>
                </aside>
            </main>

            {/* CONTROLES INFERIORES */}
            <footer className="px-8 py-6 bg-slate-950 border-t border-white/5 flex justify-center items-center gap-6 z-50">
                <div className="flex gap-3 bg-slate-900/50 p-2 rounded-[2rem] border border-white/5">
                    <button className="p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 active:scale-90 transition-all"><MicOff size={20} /></button>
                    <button className="p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 active:scale-90 transition-all"><VideoOff size={20} /></button>
                </div>

                <div className="flex gap-3 bg-slate-900/50 p-2 rounded-[2rem] border border-white/5">
                    <button 
                        onClick={() => toggleTab('users')} 
                        className={`p-4 rounded-2xl transition-all active:scale-90 ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <Users size={20} />
                    </button>
                    <button 
                        onClick={() => toggleTab('chat')} 
                        className={`p-4 rounded-2xl transition-all active:scale-90 ${activeTab === 'chat' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <MessageSquare size={20} />
                    </button>
                    <button className="p-4 text-slate-400 hover:bg-white/5 rounded-2xl active:scale-90 transition-all"><Settings size={20} /></button>
                </div>
            </footer>
        </div>
    );
};

export default AulaSesion;