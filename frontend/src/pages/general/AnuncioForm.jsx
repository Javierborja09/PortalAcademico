import React, { useState } from 'react';
import { X, Send, Calendar } from 'lucide-react';
import { crearAnuncio } from '../../services/anuncioService';

const AnuncioForm = ({ idCurso, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        titulo: '',
        contenido: '',
        fechaPublicacion: new Date().toISOString().split('T')[0] // Por defecto hoy (YYYY-MM-DD)
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Enviamos los datos al backend usando el servicio adaptado
            await crearAnuncio({ ...form, idCurso });
            onSuccess(); // Esta función recargará la lista en CursoDetalle
        } catch (error) {
            // Mostramos el mensaje de error que configuramos en el Controller
            alert(error.response?.data || "Error al crear el anuncio");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Overlay más oscuro para resaltar el formulario */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <h3 className="font-black uppercase text-xs tracking-[0.2em]">Nuevo Anuncio</h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Título del mensaje</label>
                        <input
                            required
                            type="text"
                            placeholder="Ej: Recordatorio de examen"
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:border-blue-500 outline-none transition-all"
                            value={form.titulo}
                            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Contenido</label>
                        <textarea
                            required
                            rows="4"
                            placeholder="Escribe los detalles aquí..."
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:border-blue-500 outline-none transition-all resize-none"
                            value={form.contenido}
                            onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block flex items-center gap-2">
                            <Calendar size={12} /> Programar publicación (Opcional)
                        </label>
                        <input
                            type="date"
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:border-blue-500 outline-none transition-all"
                            value={form.fechaPublicacion}
                            onChange={(e) => setForm({ ...form, fechaPublicacion: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={14} />
                            {loading ? 'Publicando...' : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnuncioForm;