import React from 'react';
import { Loader2, CalendarClock, Plus, Search } from 'lucide-react';
import { useHorarios } from '../../hooks/useHorarios';
import HorarioItem from './HorarioItem';
import HorarioAdmin from './../admin/HorarioAdmin';

const Horarios = () => {
    const {
        horarios, loading, searchTerm, setSearchTerm,
        isModalOpen, setIsModalOpen, selectedHorario,
        handleNuevoHorario, handleEditar, handleEliminar, refreshHorarios
    } = useHorarios();

    return (
        <div className="animate-fadeIn pb-20">
            <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <CalendarClock className="text-blue-600" size={28} />
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Cronograma</h1>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">Gestión de horarios y aulas por curso</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Buscar curso o día..."
                            className="pl-12 pr-6 py-4 w-full bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleNuevoHorario}
                        className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Nueva Programación</span>
                    </button>
                </div>
            </header>

            <div className="bg-transparent lg:bg-white lg:rounded-[2.5rem] lg:shadow-sm lg:border lg:border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="hidden lg:table-header-group">
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="p-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Curso</th>
                            <th className="p-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Día y Horario</th>
                            <th className="p-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Ubicación</th>
                            <th className="p-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="flex flex-col lg:table-row-group gap-4 lg:gap-0">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="py-24 text-center">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-4">Cargando...</p>
                                </td>
                            </tr>
                        ) : horarios.length > 0 ? (
                            horarios.map(h => (
                                <HorarioItem 
                                    key={h.id_horario} 
                                    horario={h} 
                                    onDelete={handleEliminar}
                                    onEdit={handleEditar} 
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="bg-white p-20 rounded-[2.5rem] text-center text-slate-400 font-bold border-2 border-dashed border-slate-100">
                                    No hay horarios que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <HorarioAdmin 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                horario={selectedHorario}
                onSave={refreshHorarios}
            />
        </div>
    );
};

export default Horarios;