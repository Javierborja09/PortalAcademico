import React, { useState, useEffect } from 'react';
import { X, UserPlus, Trash2, Search, Loader2, UserCheck } from 'lucide-react';
import api from '../../api/axiosConfig';
import { getAllUsuarios } from '../../services/userService';

const MatriculaAdmin = ({ isOpen, onClose, curso }) => {
    const [alumnosMatriculados, setAlumnosMatriculados] = useState([]);
    const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isOpen && curso) {
            cargarAlumnosMatriculados();
            cargarTodosLosUsuarios();
        }
    }, [isOpen, curso]);

    const cargarAlumnosMatriculados = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/matriculas/curso/${curso.id_curso}`);
            setAlumnosMatriculados(response.data);
        } catch (error) {
            console.error("Error al cargar matriculados", error);
        } finally {
            setLoading(false);
        }
    };

    const cargarTodosLosUsuarios = async () => {
        try {
            const data = await getAllUsuarios();
            // Filtrar solo los que tienen rol 'alumno'
            setTodosLosUsuarios(data.filter(u => u.rol?.toLowerCase() === 'alumno'));
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        }
    };

    const handleMatricular = async (idAlumno) => {
        try {
            await api.post('/matriculas/registrar', {
                idAlumno,
                idCurso: curso.id_curso,
                ciclo: "2026-I"
            });
            cargarAlumnosMatriculados();
        } catch (error) {
            alert("El alumno ya podría estar matriculado o hubo un error.");
        }
    };

    const handleRetirar = async (idMatricula) => {
        if (window.confirm("¿Retirar al alumno de este curso?")) {
            try {
                // Aquí usamos el ID de la matrícula que el controlador espera
                await api.delete(`/matriculas/eliminar/${idMatricula}`);
                cargarAlumnosMatriculados();
            } catch (error) {
                console.error("Error al retirar alumno", error);
            }
        }
    };

    if (!isOpen) return null;

    // Filtrar alumnos que NO están matriculados aún para mostrarlos en la búsqueda
    const alumnosDisponibles = todosLosUsuarios.filter(
        u => !alumnosMatriculados.some(m => m.id_usuario === u.id_usuario) &&
        (u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || u.apellido.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40 animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <h2 className="font-black text-lg uppercase tracking-tight">Matrículas</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{curso.nombreCurso}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="p-8">
                    {/* BUSCADOR PARA AGREGAR */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar alumno para matricular..." 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        {searchTerm && alumnosDisponibles.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-2xl z-20 max-h-48 overflow-y-auto p-2">
                                {alumnosDisponibles.map(u => (
                                    <div key={u.id_usuario} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                                {u.nombre[0]}{u.apellido[0]}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{u.nombre} {u.apellido}</span>
                                        </div>
                                        <button onClick={() => handleMatricular(u.id_usuario)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                            <UserPlus size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* LISTADO DE MATRICULADOS */}
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 ml-2">Alumnos Inscritos</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-600" /></div>
                        ) : alumnosMatriculados.length > 0 ? (
                            alumnosMatriculados.map(alumno => (
                                <div key={alumno.id_usuario} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={alumno.foto_perfil ? `http://localhost:8080${alumno.foto_perfil}` : "http://localhost:8080/uploads/profiles/default.png"} 
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{alumno.nombre} {alumno.apellido}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{alumno.correo}</p>
                                        </div>
                                    </div>
                                    {/* Aquí necesitamos que el backend nos devuelva el ID de la matrícula para borrar */}
                                    <button 
                                        onClick={() => handleRetirar(alumno.id_usuario)} // Nota: Cambia esto si tienes el ID_MATRICULA
                                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-10 text-slate-400 font-medium text-sm">No hay alumnos inscritos en este curso.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatriculaAdmin;