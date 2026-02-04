import React from 'react';
import { X, UserPlus, Trash2, Search, Loader2, UserCheck } from 'lucide-react';
import { useMatriculaAdmin } from '../../hooks/useMatriculaAdmin';

const MatriculaAdmin = ({ isOpen, onClose, curso }) => {
    const {
        alumnosMatriculados, alumnosDisponibles, loading,
        searchTerm, setSearchTerm, handleMatricular, handleRetirar
    } = useMatriculaAdmin(curso, isOpen);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40 animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp border border-white/10">
                
                {/* Cabecera */}
                <header className="bg-slate-900 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <h2 className="font-black text-lg uppercase tracking-tight">Panel de Matrículas</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{curso?.nombreCurso || 'Curso'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <div className="p-8">
                    {/* BUSCADOR DINÁMICO */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar alumno para matricular..." 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        {searchTerm && alumnosDisponibles.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl z-20 max-h-48 overflow-y-auto p-2">
                                {alumnosDisponibles.map(u => (
                                    <div key={u.id_usuario} className="flex items-center justify-between p-3 hover:bg-indigo-50/50 rounded-xl transition-colors">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
                                                {u.nombre[0]}{u.apellido[0]}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{u.nombre} {u.apellido}</span>
                                        </div>
                                        <button onClick={() => handleMatricular(u.id_usuario)} className="p-2 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all active:scale-90 shadow-sm">
                                            <UserPlus size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* LISTADO DE INTEGRANTES */}
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 ml-2">Alumnos en el curso</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <Loader2 className="animate-spin text-indigo-600" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Actualizando...</span>
                            </div>
                        ) : alumnosMatriculados.length > 0 ? (
                            alumnosMatriculados.map(m => (
                                <div key={m.id_usuario} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
                                    <div className="flex items-center gap-4 text-left">
                                        <img 
                                            src={m.foto_perfil ? `http://localhost:8080${m.foto_perfil}` : "http://localhost:8080/uploads/profiles/default.png"} 
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
                                            alt="Perfil"
                                            onError={(e) => { e.target.src = "http://localhost:8080/uploads/profiles/default.png"; }}
                                        />
                                        <div>
                                            <p className="text-sm font-black text-slate-800 leading-tight">{m.nombre} {m.apellido}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{m.correo}</p>
                                        </div>
                                    </div>
                                    <button 
                                        // IMPORTANTE: Aquí enviamos el ID de la MATRÍCULA
                                        onClick={() => handleRetirar(m.id_matricula)} 
                                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Retirar del curso"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 opacity-30">
                                <UserCheck size={48} className="mx-auto mb-2 text-slate-300" />
                                <p className="font-bold text-sm uppercase tracking-widest text-slate-400">Aula vacía</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatriculaAdmin;