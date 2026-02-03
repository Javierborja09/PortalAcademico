import React, { useEffect, useState } from 'react';
import { Loader2, CalendarClock, Plus, Search } from 'lucide-react';
import api from '../../api/axiosConfig';
import HorarioItem from './HorarioItem';
import HorarioAdmin from './../admin/HorarioAdmin';

const Horarios = () => {
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHorario, setSelectedHorario] = useState(null);

    useEffect(() => {
        fetchHorarios();
    }, []);

    const fetchHorarios = async () => {
        try {
            setLoading(true);
            const response = await api.get('/horarios/listar');
            setHorarios(response.data);
        } catch (error) {
            console.error("Error cargando horarios", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNuevoHorario = () => {
        setSelectedHorario(null);
        setIsModalOpen(true);
    };

    const handleEditar = (horario) => {
        setSelectedHorario(horario);
        setIsModalOpen(true);
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este horario?")) {
            try {
                await api.delete(`/horarios/eliminar/${id}`);
                setHorarios(horarios.filter(h => h.id_horario !== id));
            } catch (error) {
                alert("Error al eliminar el horario");
            }
        }
    };

    const filteredHorarios = horarios.filter(h => 
        h.curso?.nombreCurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.diaSemana.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fadeIn pb-20">
            <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <CalendarClock className="text-blue-600" size={28} />
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Cronograma</h1>
                    </div>
                    <p className="text-slate-500 font-medium text-sm md:text-base">Gestión de horarios y aulas por curso</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Buscar..."
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
                        <span className="sm:hidden">Nuevo</span>
                    </button>
                </div>
            </header>

            {/* TABLA / GRID RESPONSIVO */}
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
                        ) : filteredHorarios.length > 0 ? (
                            filteredHorarios.map(h => (
                                <HorarioItem 
                                    key={h.id_horario} 
                                    horario={h} 
                                    onDelete={handleEliminar}
                                    onEdit={handleEditar} 
                                />
                            ))
                        ) : (
                            <div className="bg-white p-20 rounded-[2.5rem] text-center text-slate-400 font-bold border-2 border-dashed border-slate-100">
                                No hay horarios registrados.
                            </div>
                        )}
                    </tbody>
                </table>
            </div>

            <HorarioAdmin 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                horario={selectedHorario}
                onSave={fetchHorarios}
            />
        </div>
    );
};

export default Horarios;