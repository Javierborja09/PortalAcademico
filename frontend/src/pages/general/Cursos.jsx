import React, { useEffect, useState } from 'react';
import { getCursosByAlumno, getAllCursos } from '../../services/courseService';
import CursoItem from './general/CursoItem';
// Importamos Lucide Icons para una interfaz moderna
import { BookOpen, Plus, Loader2, BookX, GraduationCap } from 'lucide-react';

const Cursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const userId = localStorage.getItem('userId');
    const rol = localStorage.getItem('rol')?.toLowerCase();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const data = (rol === 'admin') 
                    ? await getAllCursos() 
                    : await getCursosByAlumno(userId);
                setCursos(data);
            } catch (error) {
                console.error("Error al cargar cursos", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [rol, userId]);

    return (
        <div className="animate-fadeIn">
            {/* Header con Iconos */}
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600 hidden sm:block">
                        <GraduationCap size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            {rol === 'admin' ? 'Administración de Cursos' : 'Mis Asignaturas'}
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                            <BookOpen size={16} />
                            Explora y gestiona los contenidos académicos del ciclo.
                        </p>
                    </div>
                </div>

                {rol === 'admin' && (
                    <button className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 group">
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        Crear Curso
                    </button>
                )}
            </header>

            {/* Grid de Contenido */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className="h-64 bg-white border border-slate-100 rounded-[2.5rem] p-6 flex flex-col gap-4 animate-pulse">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                            <div className="h-6 bg-slate-100 rounded-full w-3/4"></div>
                            <div className="h-4 bg-slate-50 rounded-full w-full"></div>
                            <div className="mt-auto h-10 bg-slate-100 rounded-xl w-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cursos.length > 0 ? (
                        cursos.map((curso) => (
                            <CursoItem key={curso.id} curso={curso} rol={rol} />
                        ))
                    ) : (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center px-6">
                            <div className="p-5 bg-slate-50 rounded-full text-slate-300 mb-4">
                                <BookX size={48} />
                            </div>
                            <h3 className="text-slate-900 font-black text-xl mb-2">Sin asignaturas</h3>
                            <p className="text-slate-400 font-medium max-w-xs">
                                No hay cursos registrados en el sistema para tu perfil actualmente.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cursos;