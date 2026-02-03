import React from 'react';
import { 
  BookOpen, 
  User, 
  Settings, 
  ArrowRight, 
  Calendar 
} from 'lucide-react';

const CursoItem = ({ curso, rol }) => {
    return (
        <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group relative overflow-hidden">
            
            {/* Decoración sutil de fondo al hacer hover */}
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <span className="text-[10px] font-black tracking-[0.15em] text-blue-600 bg-blue-50/50 px-4 py-1.5 rounded-full uppercase border border-blue-100">
                    {curso.codigoCurso || 'CURSO'}
                </span>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <Calendar size={12} />
                    <span>2026-I</span>
                </div>
            </div>
            
            <div className="flex-1 relative z-10">
                <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                    {curso.nombreCurso}
                </h3>
                
                <div className="flex items-center gap-3 mb-8 bg-slate-50/80 p-3 rounded-2xl border border-slate-100/50">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                        <User size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Docente Titular</p>
                        <p className="text-sm text-slate-700 font-bold leading-none">
                            {curso.docente ? `${curso.docente.nombre} ${curso.docente.apellido}` : 'Por asignar'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <button className={`
                    w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-[0.1em] transition-all duration-300
                    ${rol === 'admin' 
                        ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200 hover:shadow-blue-500/30' 
                        : 'bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white shadow-sm'}
                `}>
                    {rol === 'admin' ? (
                        <>
                            <Settings size={16} className="group-hover:rotate-45 transition-transform" />
                            <span>Gestionar Curso</span>
                        </>
                    ) : (
                        <>
                            <BookOpen size={16} />
                            <span>Entrar al Aula</span>
                            <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CursoItem;