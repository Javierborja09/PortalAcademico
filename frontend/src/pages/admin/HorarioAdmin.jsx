import React, { useState, useEffect } from 'react';
import { X, Save, Clock, MapPin, CalendarDays, BookOpen, Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';

const HorarioAdmin = ({ isOpen, onClose, horario = null, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [formData, setFormData] = useState({
        idCurso: '',
        diaSemana: '',
        horaInicio: '',
        horaFin: '',
        aula: ''
    });

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    useEffect(() => {
        const cargarCursos = async () => {
            try {
                const res = await api.get('/cursos/listar');
                setCursos(res.data);
            } catch (err) {
                console.error("Error al cargar cursos para el horario", err);
            }
        };

        if (isOpen) {
            cargarCursos();
            if (horario) {
                setFormData({
                    idCurso: horario.curso?.id_curso || '',
                    diaSemana: horario.diaSemana,
                    horaInicio: horario.horaInicio,
                    horaFin: horario.horaFin,
                    aula: horario.aula || ''
                });
            } else {
                setFormData({ idCurso: '', diaSemana: '', horaInicio: '', horaFin: '', aula: '' });
            }
        }
    }, [isOpen, horario]);
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const horarioBody = {
        diaSemana: formData.diaSemana,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        aula: formData.aula
    };

    try {
        if (horario) {
            await api.put(`/horarios/editar/${horario.id_horario}`, horarioBody);
        } else {
            await api.post(`/horarios/agregar?idCurso=${formData.idCurso}`, horarioBody);
        }
        
        if (onSave) onSave();
        onClose();
    } catch (err) {
        console.error("Error en la petición:", err.response?.status, err.response?.data);
        
        if (err.response?.status === 403) {
            alert("Error 403: No tienes permisos o la ruta es incorrecta. Verifica el rol de Admin.");
        } else {
            alert("Error al guardar la programación");
        }
    } finally {
        setLoading(false);
    }
};
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn" onClick={onClose} />
            
            <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black">{horario ? 'Editar Programación' : 'Nueva Programación'}</h2>
                        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-1">Gestión de Horarios</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-10 space-y-6">
                    {/* Selección de Curso */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Curso Asignado</label>
                        <div className="relative">
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <select required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700 appearance-none"
                                value={formData.idCurso} onChange={e => setFormData({...formData, idCurso: e.target.value})}>
                                <option value="">Seleccionar un curso</option>
                                {cursos.map(c => <option key={c.id_curso} value={c.id_curso}>{c.nombreCurso} ({c.codigoCurso})</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Día de la Semana */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Día</label>
                            <div className="relative">
                                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <select required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700 appearance-none"
                                    value={formData.diaSemana} onChange={e => setFormData({...formData, diaSemana: e.target.value})}>
                                    <option value="">Día...</option>
                                    {dias.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Aula */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Aula / Ubicación</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
                                    value={formData.aula} onChange={e => setFormData({...formData, aula: e.target.value})} placeholder="Ej: Laboratorio A1" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Hora Inicio */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Hora Inicio</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input type="time" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
                                    value={formData.horaInicio} onChange={e => setFormData({...formData, horaInicio: e.target.value})} />
                            </div>
                        </div>

                        {/* Hora Fin */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Hora Fin</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input type="time" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
                                    value={formData.horaFin} onChange={e => setFormData({...formData, horaFin: e.target.value})} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 pt-0">
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200">
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                        {horario ? 'Actualizar Programación' : 'Crear Programación'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HorarioAdmin;