import React, { useEffect, useState } from 'react';
import { getCursosByAlumno, getAllCursos } from '../services/courseService';
import CursoItem from './general/CursoItem';

const Dashboard = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const nombre = localStorage.getItem('nombre') || 'Usuario';
    const rol = localStorage.getItem('rol')?.toLowerCase();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                // Si es admin ve todo, si es alumno/profe ve lo suyo
                const data = (rol === 'admin') 
                    ? await getAllCursos() 
                    : await getCursosByAlumno(userId);
                
                setCursos(data);
            } catch (error) {
                console.error("Error al cargar cursos en el dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [rol, userId]);

    return (
        <div className="animate-fadeIn">
            {/* Encabezado de Bienvenida */}
            <header className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Panel Principal
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Bienvenido, {nombre}. Gestiona tus actividades académicas de hoy.
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 uppercase tracking-widest">
                            Ciclo 2026-I
                        </span>
                    </div>
                </div>
            </header>

            {/* Sección de Cursos */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Mis Cursos</h2>
                    <div className="h-1 flex-1 mx-6 bg-slate-100 rounded-full hidden md:block"></div>
                </div>

                {loading ? (
                    /* Skeleton Loaders mientras carga */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cursos.length > 0 ? (
                            cursos.map(curso => (
                                <CursoItem 
                                    key={curso.id} 
                                    curso={curso} 
                                    rol={rol} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                                <span className="text-4xl block mb-2">📚</span>
                                <p className="text-slate-400 font-bold">No tienes cursos registrados en tu panel.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;