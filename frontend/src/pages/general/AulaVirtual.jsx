import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Users, Info, ArrowLeft, Loader2, Mail, GraduationCap } from 'lucide-react';

// IMPORTACIÓN DE SERVICIOS
import { getCursoById } from '../../services/courseService';
import { getIntegrantesCurso } from '../../services/matriculaService';

const AulaVirtual = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [curso, setCurso] = useState(null);
    const [integrantes, setIntegrantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

    useEffect(() => {
        const cargarDatosAula = async () => {
            try {
                setLoading(true);
                // Usamos los servicios en lugar de llamadas directas a la API
                const dataCurso = await getCursoById(id);
                setCurso(dataCurso);
                
                const dataIntegrantes = await getIntegrantesCurso(id);
                setIntegrantes(dataIntegrantes);
            } catch (error) {
                console.error("Error al cargar aula virtual", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatosAula();
    }, [id]);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs text-center">
                Sincronizando Aula Virtual...
            </p>
        </div>
    );

    return (
        <div className="animate-fadeIn pb-20">
            {/* BOTÓN VOLVER */}
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-sm group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Regresar a Cursos
            </button>

            {/* BANNER DINÁMICO */}
            <div className="relative w-full h-64 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl mb-10 border-4 border-white">
                <img 
                    src={curso?.imagenPortada ? `http://localhost:8080${curso.imagenPortada}` : "http://localhost:8080/courses/default.webp"} 
                    className="w-full h-full object-cover"
                    alt="Banner del curso"
                    onError={(e) => { e.target.src = "http://localhost:8080/courses/default.webp"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                
                <div className="absolute bottom-10 left-10 right-10">
                    <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4 inline-block border border-blue-400/30">
                        {curso?.codigoCurso || 'CÓDIGO'}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase">
                        {curso?.nombreCurso}
                    </h1>
                </div>
            </div>

            {/* PANEL DE ACCIONES RÁPIDAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Info del Profesor */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
                    <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                        <User size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Docente Titular</p>
                        <h3 className="text-xl font-black text-slate-800 uppercase">
                            {curso?.docente ? `${curso.docente.nombre} ${curso.docente.apellido}` : 'Sin asignar'}
                        </h3>
                        <button 
                            onClick={() => setIsInfoModalOpen(true)}
                            className="mt-2 flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline"
                        >
                            <Info size={16} /> Ver Información del Curso
                        </button>
                    </div>
                </div>

                {/* Botón Integrantes */}
                <button 
                    onClick={() => setIsUsersModalOpen(true)}
                    className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between group hover:bg-blue-600 transition-all duration-500"
                >
                    <div className="flex items-center gap-6 text-left">
                        <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-white">
                            <Users size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Comunidad</p>
                            <h3 className="text-xl font-black text-white uppercase">Ver Integrantes</h3>
                            <p className="text-white/40 text-xs font-bold uppercase">{integrantes.length} alumnos inscritos</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-blue-600 transition-all">
                        <ArrowLeft size={24} className="rotate-180" />
                    </div>
                </button>
            </div>

            {/* --- MODALES --- */}

            {/* Modal de Información Académica */}
            {isInfoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative shadow-2xl">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <GraduationCap className="text-blue-600" /> Silabo y Detalles
                        </h2>
                        <div className="space-y-4 text-slate-600 font-medium">
                            <p>Bienvenido al curso de <span className="font-black text-slate-900">{curso?.nombreCurso}</span>.</p>
                            <p>Docente: <span className="font-bold text-slate-800">{curso?.docente ? `${curso.docente.nombre} ${curso.docente.apellido}` : 'Pendiente'}</span></p>
                            <p>Ciclo lectivo: <span className="font-bold text-slate-800">2026-I</span></p>
                        </div>
                        <button onClick={() => setIsInfoModalOpen(false)} className="mt-8 w-full py-4 bg-slate-100 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-500 hover:bg-slate-200 transition-all">
                            Cerrar Ventana
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Integrantes */}
            {isUsersModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Compañeros de Clase</h2>
                                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">Lista oficial de inscritos</p>
                            </div>
                            <button onClick={() => setIsUsersModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <ArrowLeft size={24} className="rotate-90" />
                            </button>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid gap-4">
                                {integrantes.length > 0 ? integrantes.map(alumno => (
                                    <div key={alumno.id_usuario} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                                        <img 
                                            src={alumno.foto_perfil ? `http://localhost:8080${alumno.foto_perfil}` : "http://localhost:8080/profiles/default.png"} 
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                            alt="Perfil"
                                            onError={(e) => { e.target.src = "http://localhost:8080/profiles/default.png"; }}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-slate-800 leading-none mb-1">{alumno.nombre} {alumno.apellido}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                                                <Mail size={10} /> {alumno.correo}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center py-10 text-slate-400 font-bold uppercase text-xs">No hay alumnos matriculados aún</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AulaVirtual;