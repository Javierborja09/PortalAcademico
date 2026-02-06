import React, { useState } from 'react';
import { 
    ChevronDown, ChevronRight, FileText, 
    Edit3, Trash2, Loader2, Download, UploadCloud, X, Eye,
    FileArchive, FileCode, File, ExternalLink
} from 'lucide-react';
import { useAulaContenido } from '@/hooks/useAulaContenido';
import FilePreviewModal from './FilePreviewModal'; 

const AulaContenido = ({ idCurso, rol, onEditUnidad, onEditTema, onDelete, onUploadFile }) => {
    const { 
        unidades, 
        loading, 
        expandedUnidades, 
        expandedTemas, 
        toggleUnidad, 
        toggleTema 
    } = useAulaContenido(idCurso);

    const [preview, setPreview] = useState({ isOpen: false, file: null });

    const getFileIcon = (filename) => {
        const ext = filename.toLowerCase();
        if (ext.endsWith('.pdf')) return <FileText className="text-red-500" size={14} />;
        if (ext.match(/\.(jpg|jpeg|png|webp|gif)$/)) return <FileText className="text-emerald-500" size={14} />;
        if (ext.match(/\.(zip|rar|7z)$/)) return <FileArchive className="text-amber-500" size={14} />;
        if (ext.match(/\.(txt|doc|docx)$/)) return <FileCode className="text-blue-500" size={14} />;
        return <File className="text-slate-500" size={14} />;
    };

    const canPreview = (filename) => {
        const ext = filename.toLowerCase();
        return ext.endsWith('.pdf') || ext.match(/\.(jpg|jpeg|png|webp|gif)$/);
    };

    if (loading) return (
        <div className="py-10 flex flex-col items-center justify-center gap-2">
            <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Sincronizando...</p>
        </div>
    );

    return (
        <div className="space-y-2 animate-fadeIn px-1 md:px-0">
            {unidades.map((unidad) => (
                <div key={unidad.idUnidad} className="border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white shadow-sm">
                    {/* Header Unidad - Padding reducido */}
                    <div 
                        onClick={() => toggleUnidad(unidad.idUnidad)} 
                        className={`p-3 md:p-4 flex items-center justify-between cursor-pointer transition-colors ${
                            expandedUnidades[unidad.idUnidad] ? 'bg-blue-50/20' : 'hover:bg-slate-50'
                        }`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${
                                expandedUnidades[unidad.idUnidad] ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
                            }`}>
                                {expandedUnidades[unidad.idUnidad] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </div>
                            <h3 className="font-black text-slate-800 uppercase text-[11px] md:text-xs truncate tracking-tight">{unidad.tituloUnidad}</h3>
                        </div>
                        {rol === 'docente' && (
                            <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                <button onClick={() => onEditUnidad(unidad)} className="p-1.5 bg-white text-slate-400 hover:text-blue-600 rounded-lg border border-slate-100"><Edit3 size={12} /></button>
                                <button onClick={() => onDelete('unidad', unidad.idUnidad)} className="p-1.5 bg-white text-slate-400 hover:text-red-500 rounded-lg border border-slate-100"><Trash2 size={12} /></button>
                            </div>
                        )}
                    </div>

                    {/* Temas y Documentos - Espaciado interno reducido */}
                    {expandedUnidades[unidad.idUnidad] && (
                        <div className="p-2 md:p-4 pt-0 space-y-2 animate-slideDown bg-slate-50/20">
                            {unidad.temas?.map((tema) => (
                                <div key={tema.id_tema} className="rounded-[1rem] md:rounded-[1.5rem] border border-slate-100 overflow-hidden bg-white shadow-sm">
                                    {/* Header Tema */}
                                    <div 
                                        onClick={() => toggleTema(tema.id_tema)}
                                        className={`p-3 md:p-4 flex items-center justify-between cursor-pointer transition-colors ${
                                            expandedTemas[tema.id_tema] ? 'bg-slate-50/80' : 'hover:bg-slate-50/40'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                                            <div className={`shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all ${
                                                expandedTemas[tema.id_tema] ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                {expandedTemas[tema.id_tema] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="text-[10px] md:text-[11px] font-black text-slate-700 uppercase truncate tracking-tight">{tema.tituloTema}</h4>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase truncate max-w-[150px] md:max-w-xs">
                                                    {tema.descripcionTema || 'Sin descripción'}
                                                </p>
                                            </div>
                                        </div>
                                        {rol === 'docente' && (
                                            <div className="flex gap-1 shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                                                <button onClick={() => onUploadFile(tema.id_tema)} className="p-1.5 text-blue-600 bg-blue-50/50 rounded-lg hover:bg-blue-100"><UploadCloud size={14} /></button>
                                                <button onClick={() => onEditTema(unidad.idUnidad, tema)} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit3 size={14} /></button>
                                                <button onClick={() => onDelete('tema', tema.id_tema)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                            </div>
                                        )}
                                    </div>

                                    {/* LISTADO DE DOCUMENTOS - Compacto */}
                                    {expandedTemas[tema.id_tema] && (
                                        <div className="p-2 md:p-3 pt-0 animate-slideDown border-t border-slate-50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-2">
                                                {tema.documentos?.length > 0 ? (
                                                    tema.documentos.map(doc => {
                                                        const isPreviable = canPreview(doc.rutaArchivo);
                                                        return (
                                                            <div key={doc.id_documento} className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100 group hover:border-blue-200 transition-all shadow-xs gap-2">
                                                                <div 
                                                                    className={`flex items-center gap-2 overflow-hidden flex-1 ${isPreviable ? 'cursor-pointer' : ''}`}
                                                                    onClick={() => isPreviable && setPreview({ isOpen: true, file: doc })}
                                                                >
                                                                    <div className="shrink-0 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                                                        {getFileIcon(doc.rutaArchivo)}
                                                                    </div>
                                                                    <span className="text-[9px] font-bold text-slate-600 truncate uppercase tracking-tighter">
                                                                        {doc.tituloDocumento}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-0.5 shrink-0">
                                                                    {isPreviable && (
                                                                        <button onClick={() => setPreview({ isOpen: true, file: doc })} className="p-1 text-slate-400 hover:text-blue-600"><Eye size={13} /></button>
                                                                    )}
                                                                    <a href={`http://localhost:8080${doc.rutaArchivo}`} download className="p-1 text-slate-400 hover:text-blue-600"><Download size={13} /></a>
                                                                    {rol === 'docente' && (
                                                                        <button 
                                                                            onClick={() => onDelete('documento', doc.id_documento)} 
                                                                            className="p-1.5 ml-0.5 bg-slate-900 text-white rounded-lg shadow-sm active:scale-90 transition-transform"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="col-span-full text-center py-2 text-[8px] text-slate-400 font-bold uppercase tracking-widest italic">Vacío</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <FilePreviewModal 
                isOpen={preview.isOpen} 
                file={preview.file} 
                onClose={() => setPreview({ isOpen: false, file: null })} 
            />
        </div>
    );
};

export default AulaContenido;