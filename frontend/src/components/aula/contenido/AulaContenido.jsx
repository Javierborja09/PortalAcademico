import React, { useState } from 'react';
import { 
    ChevronDown, ChevronRight, FileText, 
    Edit3, Trash2, Loader2, Download, UploadCloud, X, Eye,
    FileArchive, FileCode, File, ExternalLink
} from 'lucide-react';
import { useAulaContenido } from '@/hooks/useAulaContenido';
import FilePreviewModal from '@/components/aula/contenido/FilePreviewModal'; 

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
                <div key={unidad.idUnidad} className="border border-slate-100 rounded-[1.2rem] md:rounded-[2rem] overflow-hidden bg-white shadow-sm">
                    {/* Header Unidad */}
                    <div 
                        onClick={() => toggleUnidad(unidad.idUnidad)} 
                        className={`p-3 md:p-4 flex items-center justify-between cursor-pointer transition-colors ${
                            expandedUnidades[unidad.idUnidad] ? 'bg-blue-50/20' : 'hover:bg-slate-50'
                        }`}
                    >
                        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                            <div className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${
                                expandedUnidades[unidad.idUnidad] ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
                            }`}>
                                {expandedUnidades[unidad.idUnidad] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>
                            <h3 className="font-black text-slate-800 uppercase text-[10px] md:text-xs truncate tracking-tight">{unidad.tituloUnidad}</h3>
                        </div>
                        {rol === 'docente' && (
                            <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                <button onClick={() => onEditUnidad(unidad)} className="p-1.5 bg-white text-slate-400 hover:text-blue-600 rounded-lg border border-slate-100"><Edit3 size={12} /></button>
                                <button onClick={() => onDelete('unidad', unidad.idUnidad)} className="p-1.5 bg-white text-slate-400 hover:text-red-500 rounded-lg border border-slate-100"><Trash2 size={12} /></button>
                            </div>
                        )}
                    </div>

                    {/* Temas */}
                    {expandedUnidades[unidad.idUnidad] && (
                        <div className="px-2 pb-3 md:px-4 md:pb-4 space-y-1.5 animate-slideDown bg-slate-50/10">
                            {unidad.temas?.map((tema) => (
                                <div key={tema.id_tema} className="rounded-[1rem] border border-slate-100 overflow-hidden bg-white shadow-sm">
                                    <div 
                                        onClick={() => toggleTema(tema.id_tema)}
                                        className={`p-2 md:p-3 flex items-center justify-between cursor-pointer transition-colors ${
                                            expandedTemas[tema.id_tema] ? 'bg-slate-50/80' : 'hover:bg-slate-50/40'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                                            <div className={`shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all ${
                                                expandedTemas[tema.id_tema] ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                {expandedTemas[tema.id_tema] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase truncate">{tema.tituloTema}</h4>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase truncate">
                                                    {tema.descripcionTema || 'Material de clase'}
                                                </p>
                                            </div>
                                        </div>
                                        {rol === 'docente' && (
                                            <div className="flex gap-1 shrink-0 ml-1" onClick={e => e.stopPropagation()}>
                                                <button onClick={() => onUploadFile(tema.id_tema)} className="p-1 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"><UploadCloud size={13} /></button>
                                                <button onClick={() => onEditTema(unidad.idUnidad, tema)} className="p-1 text-slate-400 hover:text-blue-600"><Edit3 size={13} /></button>
                                                <button onClick={() => onDelete('tema', tema.id_tema)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
                                            </div>
                                        )}
                                    </div>

                                    {/* LISTADO DE DOCUMENTOS */}
                                    {expandedTemas[tema.id_tema] && (
                                        <div className="px-2 pb-2 animate-slideDown border-t border-slate-50 bg-slate-50/20">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
                                                {tema.documentos?.length > 0 ? (
                                                    tema.documentos.map(doc => {
                                                        const isPreviable = canPreview(doc.rutaArchivo);
                                                        return (
                                                            <div key={doc.id_documento} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 group transition-all gap-2">
                                                                <div 
                                                                    className={`flex items-center gap-2 overflow-hidden flex-1 ${isPreviable ? 'cursor-pointer' : ''}`}
                                                                    onClick={() => isPreviable && setPreview({ isOpen: true, file: doc })}
                                                                >
                                                                    <div className="shrink-0 p-1 bg-slate-50 rounded border border-slate-100">
                                                                        {getFileIcon(doc.rutaArchivo)}
                                                                    </div>
                                                                    <span className="text-[9px] font-bold text-slate-600 truncate uppercase tracking-tighter leading-none">
                                                                        {doc.tituloDocumento}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-0.5 shrink-0">
                                                                    {isPreviable && (
                                                                        <button onClick={() => setPreview({ isOpen: true, file: doc })} className="p-1 text-slate-400 hover:text-blue-600"><Eye size={12} /></button>
                                                                    )}
                                                                    <a href={`http://localhost:8080${doc.rutaArchivo}`} download className="p-1 text-slate-400 hover:text-blue-600"><Download size={12} /></a>
                                                                    
                                                                    {rol === 'docente' && (
                                                                        <button 
                                                                            onClick={() => onDelete('documento', doc.id_documento)} 
                                                                            className="p-1.5 ml-0.5 bg-slate-900 text-white rounded-md shadow-sm active:scale-90 transition-transform flex items-center justify-center"
                                                                        >
                                                                            <Trash2 size={11} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="col-span-full text-center py-2 text-[8px] text-slate-300 font-bold uppercase tracking-widest italic">Vacío</p>
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