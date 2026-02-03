import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    User, Users, Info, ArrowLeft, Loader2, 
    GraduationCap, BookOpen, Video, Play, ExternalLink, ShieldAlert
} from 'lucide-react';

import { getCursoById } from '../../services/courseService';
import { getIntegrantesCurso } from '../../services/matriculaService';
import sesionService from '../../services/sesionService';

import AulaBanner from './../../components/AulaBanner';
import AulaIntegrantes from './../../components/AulaIntegrantes';
import AulaDetalle from './../../components/AulaDetalle';

const AulaVirtual = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [curso, setCurso] = useState(null);
    const [integrantes, setIntegrantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sesionActiva, setSesionActiva] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
    const [errorAcceso, setErrorAcceso] = useState(false);

    const handleBack = () => {
        navigate('/cursos');
    };

    const rol = localStorage.getItem('rol')?.toLowerCase();
    const usuarioNombre = localStorage.getItem('nombre') || 'Usuario';

    useEffect(() => {
        sesionService.conectar(id, (msg) => {
            if (msg.tipo === "START_SESSION" || msg.tipo === "SESSION_IS_ACTIVE") {
                setSesionActiva(true);
            } else if (msg.tipo === "END_SESSION" || msg.tipo === "SESSION_IS_INACTIVE") {
                setSesionActiva(false);
            }
        }, () => {
            sesionService.verificarEstado(id);
        });
        return () => sesionService.desconectar();
    }, [id]);

    useEffect(() => {
        const cargarDatosAula = async () => {
            try {
                setLoading(true);
                setErrorAcceso(false);
                const [dataCurso, dataIntegrantes] = await Promise.all([
                    getCursoById(id),
                    getIntegrantesCurso(id)
                ]);
                setCurso(dataCurso);
                setIntegrantes(dataIntegrantes);
            } catch (error) {
                if (error.response?.status === 403 || error.response?.status === 401) {
                    setErrorAcceso(true);
                }
            } finally {
                setLoading(false);
            }
        };
        cargarDatosAula();
    }, [id]);

    const handleActionSesion = () => {
        if (rol === 'docente' || rol === 'admin') {
            if (!sesionActiva) sesionService.iniciarClase(id, usuarioNombre);
            navigate(`/aula-virtual/${id}/sesion`);
        } else if (sesionActiva) {
            navigate(`/aula-virtual/${id}/sesion`);
        }
    };

    if (errorAcceso) return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 w-full">
            <div className="bg-slate-950 w-full max-w-4xl rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 flex flex-col items-center justify-center shadow-2xl border border-white/5 animate-fadeIn">
                <div className="p-6 md:p-8 bg-red-500/10 rounded-3xl md:rounded-[3rem] border border-red-500/20 mb-6 md:mb-8">
                    <ShieldAlert size={50} className="text-red-500 md:w-20 md:h-20" />
                </div>
                <div className="text-center space-y-4 mb-8 md:mb-10">
                    <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">Acceso Restringido</h1>
                    <p className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-widest max-w-md mx-auto leading-relaxed px-4">
                        No estás matriculado en este curso o no tienes permisos de docente.
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/cursos')}
                    className="w-full md:w-auto px-10 py-4 md:py-5 bg-white text-slate-950 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl"
                >
                    Volver a mis cursos
                </button>
            </div>
        </div>
    );

    if (loading) return (
        <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4 text-blue-600">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="font-black uppercase tracking-widest text-[10px]">Cargando Aula Virtual...</p>
        </div>
    );

    return (
        <div className="animate-fadeIn pb-20 w-full max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-6 md:mb-8 pt-4">
                {/* CAMBIO: Usar handleBack en lugar de navigate(-1) */}
                <button 
                    onClick={handleBack} 
                    className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs md:text-sm group transition-all"
                >
                    <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-blue-50">
                        <ArrowLeft size={16} />
                    </div>
                    Volver a mis cursos
                </button>
            </div>

            <AulaBanner curso={curso} />

            {/* BANNER SESIÓN - Responsivo */}
            <div className={`mb-8 md:mb-10 rounded-[2.5rem] md:rounded-[3rem] p-1 border shadow-2xl overflow-hidden relative transition-all duration-700 ${sesionActiva ? 'bg-emerald-950 border-emerald-500/30' : 'bg-slate-900 border-white/5'}`}>
                {sesionActiva && <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />}
                <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg transition-all duration-500 ${sesionActiva ? 'bg-emerald-500' : 'bg-white/10'}`}>
                            <Video size={28} className="md:w-9 md:h-9" />
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                                {sesionActiva ? '¡Clase en vivo!' : 'Videoconferencia'}
                            </h2>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${sesionActiva ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {sesionActiva ? 'Hay una sesión activa' : 'Esperando al docente'}
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={handleActionSesion}
                        disabled={rol === 'alumno' && !sesionActiva}
                        className={`w-full md:w-auto px-8 py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${
                            (rol === 'docente' || sesionActiva) 
                            ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95' 
                            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                        }`}
                    >
                        {rol === 'docente' ? (
                            <>{sesionActiva ? 'Reingresar' : 'Iniciar Clase'} <Play size={14} /></>
                        ) : (
                            <>{sesionActiva ? 'Unirse ahora' : 'Cerrada'} <ExternalLink size={14} /></>
                        )}
                    </button>
                </div>
            </div>

            {/* GRID DE INFORMACIÓN - Responsivo (1 col en móvil, 2 en desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-4 md:gap-6 group hover:shadow-xl transition-all">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                        <User size={28} className="md:w-8 md:h-8" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Docente</p>
                        <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase leading-none break-words">
                            {curso?.docente ? `${curso.docente.nombre} ${curso.docente.apellido}` : 'Sin asignar'}
                        </h3>
                        <button onClick={() => setIsInfoModalOpen(true)} className="mt-2 md:mt-3 flex items-center gap-2 text-blue-600 font-bold text-[10px] md:text-xs hover:underline uppercase">
                            <Info size={12} /> Detalles
                        </button>
                    </div>
                </div>

                <button onClick={() => setIsUsersModalOpen(true)} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all">
                    <div className="flex items-center gap-4 md:gap-6 text-left">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Users size={28} className="md:w-8 md:h-8" />
                        </div>
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Comunidad</p>
                            <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase leading-none">Ver Lista</h3>
                            <p className="text-blue-600 text-[10px] font-bold mt-1 uppercase">{integrantes.length} Matriculados</p>
                        </div>
                    </div>
                </button>

                <div className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 p-6 md:p-10 min-h-[300px]">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 mb-6 md:mb-8">
                        <BookOpen className="text-blue-600 w-5 h-5 md:w-6 md:h-6" /> Repositorio
                    </h2>
                    <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center border-2 border-dashed border-slate-100 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50/20">
                        <GraduationCap size={40} className="text-slate-200 mb-4 md:w-12 md:h-12" />
                        <p className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.4em] max-w-[180px] md:max-w-[200px]">
                            Sin recursos publicados
                        </p>
                    </div>
                </div>
            </div>

            <AulaIntegrantes isOpen={isUsersModalOpen} onClose={() => setIsUsersModalOpen(false)} integrantes={integrantes} />
            <AulaDetalle isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} curso={curso} />
        </div>
    );
};

export default AulaVirtual;