import React from 'react';
import { useHorario } from '@/hooks/useHorario';
import { Clock, Calendar, MapPin, BookOpen }  from 'lucide-react'

const Horario = () => {
    const { cursos, horarios, loading, rol } = useHorario();

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                {[1, 2, 3, 4].map(n => (
                    <div key={n} className="h-40 bg-slate-100 animate-pulse rounded-3xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="animate-fadeIn px-4 pb-10">
            <header className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    {rol === 'docente' ? 'Mi Agenda de Clases' : 'Mi Horario Académico'}
                </h1>
                <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    Visualización de tus actividades programadas.
                </p>
            </header>

            <div className="space-y-8">
                {cursos.length > 0 ? (
                    cursos.map((curso) => (
                        <section key={curso.id_curso} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                                            {curso.nombreCurso}
                                        </h2>
                                        <p className="text-slate-400 font-mono text-sm">{curso.codigoCurso}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {horarios[curso.id_curso] && horarios[curso.id_curso].length > 0 ? (
                                    horarios[curso.id_curso].map((h) => (
                                        <div 
                                            key={h.id_horario} 
                                            className="group bg-slate-50 hover:bg-blue-600 transition-all duration-300 rounded-2xl p-5 border border-slate-100 flex flex-col gap-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg text-blue-600 group-hover:text-blue-700">
                                                    <Calendar size={18} />
                                                </div>
                                                <span className="font-bold text-slate-700 group-hover:text-white uppercase">
                                                    {h.diaSemana}
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-100">
                                                    <Clock size={14} />
                                                    <span className="text-sm font-semibold">
                                                        {h.horaInicio} - {h.horaFin}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-200">
                                                    <MapPin size={14} />
                                                    <span className="text-xs font-medium">
                                                        {h.aula || 'Aula por asignar'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-6 px-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-sm italic">
                                        No hay horarios registrados para esta asignatura.
                                    </div>
                                )}
                            </div>
                        </section>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <div className="p-6 bg-slate-50 rounded-full mb-4">
                            <Clock size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Sin cursos registrados</h3>
                        <p className="text-slate-500">No se encontraron cursos asignados a tu cuenta.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Horario;