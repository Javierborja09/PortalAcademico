import React from 'react';
import { useCursos } from '@/hooks/useCursos';
import CursoAdmin from '@/pages/admin/CursoAdmin';
import { BookOpen, Plus, BookX, GraduationCap } from 'lucide-react';
import CursoItem from '@/components/CursoItem';
const Cursos = () => {
    const { 
        cursos, loading, rol, 
        isAdminModalOpen, openAdminModal, closeAdminModal, 
        refreshCursos 
    } = useCursos();

    return (
        <div className="animate-fadeIn">
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
                                ? 'Gestiona tus clases y alumnos asignados.' 
                                : 'Explora los contenidos académicos del ciclo.'}
                        </p>
                    </div>
                </div>

                {rol === 'admin' && (
                    <button 
                        onClick={openAdminModal}
                        className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        Crear Curso
                    </button>
                )}
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className="h-72 bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col gap-4 animate-pulse">
                            <div className="w-full h-24 bg-slate-100 rounded-[1.5rem]"></div>
                            <div className="h-6 bg-slate-100 rounded-full w-3/4"></div>
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
                                onRefresh={refreshCursos} 
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center px-6">
                            <BookX size={48} className="text-slate-300 mb-4" />
                            <h3 className="text-slate-900 font-black text-xl mb-2">Sin asignaturas</h3>
                        </div>
                    )}
                </div>
            )}

            {rol === 'admin' && (
                <CursoAdmin 
                    isOpen={isAdminModalOpen} 
                    onClose={closeAdminModal} 
                    onSave={refreshCursos} 
                />
            )}
        </div>
    );
};

export default Cursos;