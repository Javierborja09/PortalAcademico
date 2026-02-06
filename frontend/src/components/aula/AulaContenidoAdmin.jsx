import React from "react";
import { 
    Plus, Edit3, Trash2, X, Save, Layout, FileText, 
    Type, AlignLeft, Loader2, UploadCloud, Download 
} from "lucide-react";
import { useContenidoAdmin } from "@/hooks/useContenidoAdmin";

const AulaContenidoAdmin = ({ idCurso, unidades, onRefresh }) => {
    const {
        // Estructura (Unidades/Temas)
        modal, form, setForm, loading,
        openUnidadModal, openTemaModal, closeModal, handleSubmit,
        
        // Archivos (Documentos)
        fileModal, fileData, setFileData,
        openUploadModal, closeUploadModal, handleFileSubmit,
        
        // General
        handleDelete
    } = useContenidoAdmin(idCurso, onRefresh);

    return (
        <div className="space-y-6">
            {/* Header de Administración */}
            <div className="flex justify-between items-center mb-8">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    Panel de Gestión de Contenidos
                </p>
                <button
                    onClick={() => openUnidadModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] hover:bg-blue-600 transition-all shadow-xl"
                >
                    <Plus size={14} /> Nueva Unidad
                </button>
            </div>

            {/* Lista de Gestión Jerárquica */}
            <div className="space-y-4">
                {unidades.map((u) => (
                    <div key={u.idUnidad} className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600">
                                    <Layout size={18} />
                                </div>
                                <h3 className="font-black text-slate-800 uppercase text-sm">{u.tituloUnidad}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openUnidadModal(u)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all">
                                    <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDelete("unidad", u.idUnidad)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Temas y Documentos */}
                        <div className="pl-8 space-y-4">
                            {u.temas?.map((t) => (
                                <div key={t.id_tema} className="bg-white p-5 rounded-[2rem] border border-slate-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className="text-slate-400" />
                                            <span className="text-xs font-bold text-slate-600 uppercase">{t.tituloTema}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => openUploadModal(t.id_tema)} title="Subir Archivo" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><UploadCloud size={16}/></button>
                                            <button onClick={() => openTemaModal(u.idUnidad, t)} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit3 size={16} /></button>
                                            <button onClick={() => handleDelete("tema", t.id_tema)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    {/* Mini lista de documentos subidos */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                        {t.documentos?.map(doc => (
                                            <div key={doc.id_documento} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100 group">
                                                <span className="text-[9px] font-black text-slate-500 truncate uppercase pl-2">{doc.tituloDocumento}</span>
                                                <button onClick={() => handleDelete("documento", doc.id_documento)} className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={12}/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => openTemaModal(u.idUnidad)}
                                className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-[9px] font-black text-slate-400 uppercase hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={12} /> Agregar Tema
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL 1: UNIDADES Y TEMAS (BLUR) */}
            {modal.isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn" onClick={closeModal} />
                    <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
                        <header className="bg-slate-900 p-8 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight">{modal.mode === "create" ? "Crear" : "Editar"} {modal.type}</h2>
                                <p className="text-blue-400 text-[9px] font-bold uppercase tracking-widest mt-1">Gestión de Contenidos</p>
                            </div>
                            <button type="button" onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
                        </header>
                        <div className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Título</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
                                        placeholder={`Nombre de la ${modal.type}...`} />
                                </div>
                            </div>
                            {modal.type === "tema" && (
                                <div className="space-y-2 animate-slideDown">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Descripción</label>
                                    <textarea rows="3" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                        className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700 resize-none"
                                        placeholder="Breve descripción..." />
                                </div>
                            )}
                        </div>
                        <div className="p-10 pt-0">
                            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:bg-slate-100">
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* MODAL 2: SUBIR ARCHIVOS (BLUR) */}
            {fileModal.isOpen && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn" onClick={closeUploadModal} />
                    <form onSubmit={handleFileSubmit} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
                        <header className="bg-blue-600 p-8 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Subir Material</h2>
                                <p className="text-blue-100 text-[9px] font-bold uppercase tracking-widest mt-1">PDF, Imágenes o Documentos</p>
                            </div>
                            <button type="button" onClick={closeUploadModal} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
                        </header>
                        <div className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nombre del Archivo</label>
                                <input required value={fileData.titulo} onChange={(e) => setFileData({...fileData, titulo: e.target.value})}
                                    className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
                                    placeholder="Ej: Guía Práctica 01" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Seleccionar Archivo físico</label>
                                <input type="file" required onChange={(e) => setFileData({...fileData, archivo: e.target.files[0]})}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all" />
                            </div>
                        </div>
                        <div className="p-10 pt-0">
                            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:bg-slate-100">
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
                                Confirmar Subida
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AulaContenidoAdmin;