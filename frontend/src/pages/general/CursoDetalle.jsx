import React from 'react';
import { X, Clock, MapPin, CalendarDays, BookOpen, Trash2, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAnunciosByCurso, eliminarAnuncio } from '../../services/anuncioService';
import AnuncioForm from './AnuncioForm';

const CursoDetalle = ({ isOpen, onClose, curso, horarios }) => {
    const [anuncios, setAnuncios] = useState([]);
    const [loadingAnuncios, setLoadingAnuncios] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [anuncioAEditar, setAnuncioAEditar] = useState(null);
    
    const rol = localStorage.getItem('rol')?.toLowerCase();
    const hoy = new Date().toLocaleDateString('en-CA');
    const esDocente = rol === 'docente';

    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este anuncio?")) {
            try {
                await eliminarAnuncio(id);
                cargarAnuncios();
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    useEffect(() => {
        if (isOpen && curso?.id_curso) {
            cargarAnuncios();
        }
    }, [isOpen, curso]);

    const cargarAnuncios = async () => {
        try {
            setLoadingAnuncios(true);
            const data = await getAnunciosByCurso(curso.id_curso);
            setAnuncios(data);
        } catch (error) {
            console.error("Error al cargar anuncios", error);
        } finally {
            setLoadingAnuncios(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

                <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
                    <div className="bg-slate-900 p-8 text-white relative">
                        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="text-blue-400" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Detalles del Curso</span>
                        </div>
                        <h2 className="text-2xl font-black leading-tight">{curso.nombreCurso}</h2>
                        <p className="text-blue-400 text-xs font-bold mt-1 uppercase tracking-widest">{curso.codigoCurso}</p>
                    </div>

                    <div className="p-8 max-h-[80vh] overflow-y-auto"> {/* Corregido: max-h-100 no es estándar de tailwind */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Anuncios</h3>
                                {esDocente && (
                                    <button
                                        onClick={() => setIsFormOpen(true)}
                                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                                    >
                                        + Crear anuncio
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                {loadingAnuncios ? (
                                    <p className="text-[10px] text-slate-400 animate-pulse font-bold uppercase">Cargando anuncios...</p>
                                ) : anuncios.length > 0 ? (
                                    anuncios.map((anuncio) => {
                                        // 2. Definimos la lógica de fecha DENTRO del map
                                        const esAnuncioFuturo = anuncio.fechaPublicacion > hoy;

                                        // 3. AGREGADO: RETURN explícito (Esto era lo que ponía la pantalla en blanco)
                                        return (
                                            <div
                                                key={anuncio.id_anuncio}
                                                className={`p-4 rounded-2xl relative group transition-all border ${
                                                    esAnuncioFuturo
                                                        ? 'bg-amber-50/40 border-dashed border-amber-200 shadow-sm'
                                                        : 'bg-blue-50 border-blue-100'
                                                }`}
                                            >

                                                {esDocente && (
                                                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => {
                                                                setAnuncioAEditar(anuncio);
                                                                setIsFormOpen(true);
                                                            }}
                                                            className="p-1.5 bg-white text-blue-600 hover:bg-blue-100 rounded-lg shadow-sm border border-blue-100 transition-colors"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEliminar(anuncio.id_anuncio)}
                                                            className="p-1.5 bg-white text-red-500 hover:bg-red-100 rounded-lg shadow-sm border border-red-100 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}

                                                <p className="text-sm font-black text-slate-800 pr-12">{anuncio.titulo}</p>
                                                <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">{anuncio.contenido}</p>

                                                <div className="flex items-center gap-2 mt-3">
                                                    <p className={`text-[10px] font-bold uppercase ${esAnuncioFuturo ? 'text-amber-600' : 'text-slate-400'}`}>
                                                        {esAnuncioFuturo ? '🕒 Se publicará: ' : '✅ Publicado: '}
                                                        {anuncio.fechaPublicacion}
                                                    </p>
                                                </div>
                                            </div>
                                        ); // Cierre del return
                                    })
                                ) : (
                                    <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                        <p className="text-[10px] text-slate-400 italic uppercase font-bold">No hay anuncios disponibles.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cronograma Semanal */}
                        <div className="flex items-center gap-2 mb-6">
                            <CalendarDays className="text-slate-400" size={18} />
                            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Cronograma Semanal</h3>
                        </div>

                        <div className="space-y-4">
                            {horarios.length > 0 ? (
                                horarios.map((h) => (
                                    <div key={h.id_horario} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm font-bold text-xs">
                                                {h.diaSemana.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800">{h.diaSemana}</p>
                                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                                                    <Clock size={12} />
                                                    {h.horaInicio.substring(0, 5)} - {h.horaFin.substring(0, 5)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-slate-100 text-[10px] font-black text-slate-500 uppercase">
                                            <MapPin size={10} />
                                            {h.aula}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                    <p className="text-slate-400 text-sm font-bold italic">No hay horarios programados aún.</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all"
                        >
                            Cerrar Detalles
                        </button>
                    </div>
                </div>
            </div>

            {isFormOpen && (
                <AnuncioForm
                    idCurso={curso.id_curso}
                    anuncioAEditar={anuncioAEditar}
                    onClose={() => {
                        setIsFormOpen(false);
                        setAnuncioAEditar(null);
                    }}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        setAnuncioAEditar(null);
                        cargarAnuncios();
                    }}
                />
            )}
        </>
    );
};

export default CursoDetalle;