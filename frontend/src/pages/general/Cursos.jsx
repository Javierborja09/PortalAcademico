import React, { useEffect, useState } from 'react';
// Importamos los servicios necesarios incluyendo el de docente
import { getCursosByAlumno, getAllCursos, getCursosByDocente } from '../../services/courseService';
import CursoItem from './CursoItem';
import CursoAdmin from './../../pages/admin/CursoAdmin';
import { BookOpen, Plus, BookX, GraduationCap } from 'lucide-react';

const Cursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    
    // Obtenemos datos de sesión
    const userId = localStorage.getItem('userId');
    const rol = localStorage.getItem('rol')?.toLowerCase();

    // Función principal para cargar datos según el rol del usuario
    const cargarDatos = async () => {
        try {
            setLoading(true);
            let data = [];

            // Lógica de bifurcación de peticiones según el rol
            if (rol === 'admin') {
                data = await getAllCursos();
            } else if (rol === 'docente') {
                data = await getCursosByDocente(userId);
            } else {
                // Rol de alumno o por defecto
                data = await getCursosByAlumno(userId);
            }

            setCursos(data);
        } catch (error) {
            console.error("Error al cargar cursos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId && rol) {
            cargarDatos();
        }
    }, [rol, userId]);

    return (
        <div className="animate-fadeIn">
            {/* Cabecera dinámica según el rol del usuario */}
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600 hidden sm:block">
                        <GraduationCap size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            {rol === 'admin' ? 'Administración de Cursos' : 
                             rol === 'docente' ? 'Cursos Dictados' : 'Mis Asignaturas'}
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
                            <BookOpen size={16} />
                            {rol === 'docente' 
                                ? 'Gestiona tus clases y alumnos asignados para este ciclo.' 
                                : 'Explora y gestiona los contenidos académicos del ciclo.'}
                        </p>
                    </div>
                </div>

                {/* Botón de creación exclusivo para administradores */}
                {rol === 'admin' && (
                    <button 
                        onClick={() => setIsAdminModalOpen(true)}
                        className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        Crear Curso
                    </button>
                )}
            </header>

            {/* Grid de Contenido con Skeletons de carga */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className="h-72 bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col gap-4 animate-pulse">
                            <div className="w-full h-24 bg-slate-100 rounded-[1.5rem]"></div>
                            <div className="h-6 bg-slate-100 rounded-full w-3/4"></div>
                            <div className="h-4 bg-slate-50 rounded-full w-full"></div>
                            <div className="mt-auto h-12 bg-slate-100 rounded-xl w-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cursos.length > 0 ? (
                        cursos.map((curso) => (
                            <CursoItem 
                                key={curso.id_curso} 
                                curso={curso} 
                                rol={rol} 
                                onRefresh={cargarDatos} 
                            />
                        ))
                    ) : (
                        /* Estado vacío cuando no hay resultados */
                        <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center px-6">
                            <div className="p-5 bg-slate-50 rounded-full text-slate-300 mb-4">
                                <BookX size={48} />
                            </div>
                            <h3 className="text-slate-900 font-black text-xl mb-2">Sin asignaturas</h3>
                            <p className="text-slate-400 font-medium max-w-xs">
                                No se encontraron cursos registrados para tu perfil en el ciclo actual.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal para Crear o Editar Cursos (Solo Admin) */}
            {rol === 'admin' && (
                <CursoAdmin 
                    isOpen={isAdminModalOpen} 
                    onClose={() => setIsAdminModalOpen(false)} 
                    onSave={cargarDatos} 
                />
            )}
        </div>
    );
};

export default Cursos;