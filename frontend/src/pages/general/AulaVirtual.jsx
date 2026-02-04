import React from 'react';
import { 
    User, Users, Info, ArrowLeft, Loader2, 
    GraduationCap, BookOpen, Video, Play, ExternalLink, ShieldAlert
} from 'lucide-react';
import { useAulaVirtual } from './../../hooks/useAulaVirtual';

// Componentes estandarizados con Aliases
import AulaBanner from './../../components/AulaBanner';
import AulaIntegrantes from './../../components/AulaIntegrantes';
import AulaDetalle from './../../components/AulaDetalle';
import Avatar from './../../components/common/Avatar';

const AulaVirtual = () => {
    const { 
        curso, integrantes, loading, sesionActiva, errorAcceso, rol, 
        modals, handleBack, handleActionSesion 
    } = useAulaVirtual();

    // Pantalla de Error de Acceso
    if (errorAcceso) return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 w-full">
            <div className="bg-slate-950 w-full max-w-4xl rounded-[4rem] p-20 flex flex-col items-center justify-center shadow-2xl border border-white/5 animate-fadeIn">
                <div className="p-8 bg-red-500/10 rounded-[3rem] border border-red-500/20 mb-8">
                    <ShieldAlert size={80} className="text-red-500" />
                </div>
                <div className="text-center space-y-4 mb-10">
                    <h1 className="text-4xl font-black uppercase text-white">Acceso Restringido</h1>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                        No estás matriculado en este curso o no tienes permisos de docente.
                    </p>
                </div>
                <button onClick={handleBack} className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Volver a mis cursos
                </button>
            </div>
        </div>
    );

    // Estado de Carga
    if (loading) return (
        <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4 text-blue-600">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="font-black uppercase tracking-widest text-[10px]">Cargando Aula Virtual...</p>
        </div>
    );

    return (
        <div className="animate-fadeIn pb-20 w-full max-w-7xl mx-auto px-4 md:px-8">
            {/* Cabecera de Navegación */}
            <div className="flex items-center justify-between mb-8 pt-4">
                <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm group transition-all">
                    <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-blue-50">
                        <ArrowLeft size={16} />
                    </div>
                    Volver a mis cursos
                </button>
            </div>

            <AulaBanner curso={curso} />

            {/* BANNER DINÁMICO DE SESIÓN EN VIVO */}
            <div className={`mb-10 rounded-[3rem] p-1 border shadow-2xl overflow-hidden relative transition-all duration-700 ${sesionActiva ? 'bg-emerald-950 border-emerald-500/30' : 'bg-slate-900 border-white/5'}`}>
                {sesionActiva && <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />}
                <div className="relative p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-500 ${sesionActiva ? 'bg-emerald-500' : 'bg-white/10'}`}>
                            <Video size={36} />
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl font-black uppercase tracking-tight">
                                {sesionActiva ? '¡Clase en vivo!' : 'Videoconferencia'}
                            </h2>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${sesionActiva ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {sesionActiva ? 'Hay una sesión activa en este momento' : 'Esperando a que el docente inicie la clase'}
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={handleActionSesion}
                        disabled={rol === 'alumno' && !sesionActiva}
                        className={`px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-3 shadow-xl ${
                            (rol === 'docente' || sesionActiva) 
                            ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95' 
                            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                        }`}
                    >
                        {rol === 'docente' ? (
                            <>{sesionActiva ? 'Reingresar a Sesión' : 'Iniciar Clase'} <Play size={14} /></>
                        ) : (
                            <>{sesionActiva ? 'Unirse ahora' : 'Sesión Cerrada'} <ExternalLink size={14} /></>
                        )}
                    </button>
                </div>
            </div>

            {/* GRID DE INFORMACIÓN DEL CURSO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* TARJETA DEL DOCENTE (Solución Foto del Profesor) */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-all">
                    <div className="relative group/avatar">
                        <Avatar 
                            src={curso?.docente?.foto_perfil} 
                            type="perfil" 
                            className="w-20 h-20 rounded-3xl border-none shadow-lg group-hover:scale-105"
                            alt="Foto del docente"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-xl flex items-center justify-center text-white border-4 border-white shadow-md">
                            <User size={10} strokeWidth={3} />
                        </div>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Docente Titular</p>
                        <h3 className="text-xl font-black text-slate-800 uppercase leading-none">
                            {curso?.docente ? `${curso.docente.nombre} ${curso.docente.apellido}` : 'Sin asignar'}
                        </h3>
                        <button onClick={() => modals.info.set(true)} className="mt-3 flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline uppercase tracking-tighter">
                            <Info size={12} /> Detalles Académicos
                        </button>
                    </div>
                </div>

                {/* TARJETA DE COMUNIDAD */}
                <button onClick={() => modals.users.set(true)} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all">
                    <div className="flex items-center gap-6 text-left">
                        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Users size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Comunidad</p>
                            <h3 className="text-xl font-black text-slate-800 uppercase leading-none">Participantes</h3>
                            <p className="text-blue-600 text-[10px] font-bold mt-1 uppercase">{integrantes.length} Alumnos Inscritos</p>
                        </div>
                    </div>
                </button>

                {/* REPOSITORIO DE ARCHIVOS */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-10 min-h-[300px]">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 mb-8">
                        <BookOpen className="text-blue-600" /> Repositorio de Materiales
                    </h2>
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/20">
                        <GraduationCap size={48} className="text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Sin recursos publicados para este ciclo</p>
                    </div>
                </div>
            </div>

            {/* Modales Modulares */}
            <AulaIntegrantes 
                isOpen={modals.users.isOpen} 
                onClose={() => modals.users.set(false)} 
                integrantes={integrantes} 
            />
            <AulaDetalle 
                isOpen={modals.info.isOpen} 
                onClose={() => modals.info.set(false)} 
                curso={curso} 
            />
        </div>
    );
};

export default AulaVirtual;