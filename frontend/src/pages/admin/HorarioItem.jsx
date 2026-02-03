import React from 'react';
import { Pencil, Trash2, Clock, MapPin, CalendarDays, BookOpen } from 'lucide-react';

const HorarioItem = ({ horario, onEdit, onDelete }) => {
    return (
        <tr className="flex flex-col lg:table-row bg-white lg:bg-transparent p-6 lg:p-0 rounded-[2rem] lg:rounded-none shadow-sm lg:shadow-none border border-slate-100 lg:border-0 lg:border-b lg:border-slate-50 hover:bg-slate-50/80 transition-all duration-300 group relative">
            
            {/* CURSO */}
            <td className="p-0 lg:p-5 mb-4 lg:mb-0">
                <div className="flex items-center gap-3">
                    <div className="p-3 lg:p-2 bg-blue-50 text-blue-600 rounded-2xl lg:rounded-lg">
                        <BookOpen size={20} className="lg:w-[18px] lg:h-[18px]" />
                    </div>
                    <div>
                        <p className="text-base lg:text-sm font-black text-slate-800 leading-tight">
                            {horario.curso?.nombreCurso}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            {horario.curso?.codigoCurso}
                        </p>
                    </div>
                </div>
            </td>

            {/* DÍA Y HORARIO */}
            <td className="p-0 lg:p-5 mb-4 lg:mb-0">
                <div className="flex flex-row lg:flex-col gap-3 lg:gap-1">
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm bg-slate-50 lg:bg-transparent px-3 py-1 rounded-full lg:p-0">
                        <CalendarDays size={14} className="text-blue-500 lg:text-slate-400" />
                        {horario.diaSemana}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                        <Clock size={14} className="text-slate-300" />
                        <span>{horario.horaInicio} - {horario.horaFin}</span>
                    </div>
                </div>
            </td>

            {/* UBICACIÓN */}
            <td className="p-0 lg:p-5 mb-4 lg:mb-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 lg:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-200/50">
                    <MapPin size={14} className="text-blue-500" />
                    <span className="lg:hidden text-slate-400 font-medium mr-1">Aula:</span>
                    {horario.aula || 'Virtual'}
                </div>
            </td>

            {/* ACCIONES */}
            <td className="p-0 lg:p-5 lg:text-right absolute top-6 right-6 lg:relative lg:top-0 lg:right-0">
                <div className="flex justify-end gap-2 lg:gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                    <button 
                        onClick={() => onEdit(horario)}
                        className="p-3 lg:p-2.5 bg-slate-50 lg:bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl border border-slate-100 lg:border-transparent transition-all active:scale-90"
                    >
                        <Pencil size={18} className="lg:w-4 lg:h-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(horario.id_horario)}
                        className="p-3 lg:p-2.5 bg-slate-50 lg:bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl border border-slate-100 lg:border-transparent transition-all active:scale-90"
                    >
                        <Trash2 size={18} className="lg:w-4 lg:h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default HorarioItem;