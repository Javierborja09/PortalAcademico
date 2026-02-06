import React from 'react';
import { X, ExternalLink, Download, FileText, File } from 'lucide-react';

const FilePreviewModal = ({ isOpen, file, onClose }) => {
    if (!isOpen || !file) return null;

    const getFileIcon = (filename = "") => {
        const ext = filename.toLowerCase();
        if (ext.endsWith('.pdf')) return <FileText className="text-red-500" size={20} />;
        if (ext.match(/\.(jpg|jpeg|png|webp|gif)$/)) return <FileText className="text-emerald-500" size={20} />;
        return <File className="text-blue-500" size={20} />;
    };

    const isPdf = file.rutaArchivo.toLowerCase().endsWith('.pdf');
    const fullUrl = `http://localhost:8080${file.rutaArchivo}`;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8 animate-fadeIn">
            {/* Fondo oscuro con desenfoque */}
            <div 
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl transition-opacity" 
                onClick={onClose} 
            />
            
            {/* Contenedor Principal */}
            <div className="relative bg-white w-full h-full max-w-6xl rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-scaleUp flex flex-col border border-white/20">
                
                {/* Header dinámico */}
                <header className="bg-slate-900 p-6 text-white flex justify-between items-center shadow-lg border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
                            {getFileIcon(file.rutaArchivo)}
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-sm font-black uppercase tracking-tight truncate max-w-xs md:max-w-md">
                                {file.tituloDocumento}
                            </h2>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                                Visor de Material Académico
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Botones de acción rápida */}
                        <a 
                            href={fullUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase transition-all"
                        >
                            <ExternalLink size={14} /> Abrir Original
                        </a>
                        <a 
                            href={fullUrl} 
                            download
                            className="p-3 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"
                        >
                            <Download size={20} />
                        </a>
                        <button 
                            onClick={onClose}
                            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-50 hover:text-white rounded-2xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </header>

                {/* Área de Visualización */}
                <div className="flex-1 bg-slate-100 p-2 md:p-6 overflow-hidden relative">
                    {isPdf ? (
                        <iframe 
                            src={`${fullUrl}#toolbar=0&navpanes=0`} 
                            className="w-full h-full rounded-[1.5rem] border-none shadow-2xl bg-white"
                            title="PDF Preview"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200/50 rounded-[2rem] border-4 border-dashed border-slate-300/50 overflow-auto p-4">
                            <img 
                                src={fullUrl} 
                                alt="Preview" 
                                crossOrigin="anonymous"
                                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg transition-transform hover:scale-[1.01]"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilePreviewModal;