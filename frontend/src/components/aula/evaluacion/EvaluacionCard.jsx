import React from "react";
import {
    Calendar, Eye, Edit, Trash2, Send, FileText,
    FileArchive, FileCode, File, Clock, AlertCircle
} from "lucide-react";

const EvaluacionCard = ({
    evaluacion,
    rol = "alumno",
    entregas = [],
    onPreview = () => {},
    onVerEntregas = () => {},
    onEditar = () => {},
    onEliminar = () => {},
    onEnviar = () => {},
    evaluacionExpirada = (fecha) => new Date(fecha) < new Date(),
    puedeEnviar = () => false
}) => {
    const fechaLimiteBase = new Date(evaluacion.fechaLimite || evaluacion.fecha_limite || evaluacion.fecha_fin);
    const expirada = evaluacionExpirada(fechaLimiteBase);
    
    // MEJORA: Detectar entrega si hay array O si el objeto evaluación ya trae una nota/calificación
    const notaDirecta = evaluacion.nota ?? evaluacion.calificacion;
    const yaEntregado = entregas.length > 0 || (notaDirecta !== null && notaDirecta !== undefined);
    
    // MEJORA: Obtener la nota de donde sea que esté disponible
    const ultimaNota = entregas.length > 0 ? entregas[0].nota : notaDirecta;

    const getNotaEstilo = (nota) => {
        if (nota === null || nota === undefined || nota === "--") return "bg-slate-50 border-slate-100 text-slate-400";
        const n = parseFloat(nota);
        if (isNaN(n)) return "bg-slate-50 border-slate-100 text-slate-400";
        if (n < 13) return "bg-red-50 border-red-100 text-red-600";
        if (n >= 13 && n <= 17) return "bg-amber-50 border-amber-100 text-amber-600";
        return "bg-emerald-50 border-emerald-100 text-emerald-600";
    };

    const getFileIcon = (filename) => {
        const ext = filename?.toLowerCase() || "";
        if (ext.endsWith(".pdf")) return <FileText className="text-red-500" size={16} />;
        if (ext.match(/\.(zip|rar|7z)$/)) return <FileArchive className="text-amber-500" size={16} />;
        return <File className="text-slate-500" size={16} />;
    };

    return (
        <div className={`bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all group relative ${expirada && !yaEntregado ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    
                    {/* INFO IZQUIERDA */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1 rounded-lg uppercase border border-blue-100">Evaluación</span>
                            {expirada ? (
                                <span className="bg-red-50 text-red-600 text-[9px] font-black px-3 py-1 rounded-lg uppercase border border-red-100 flex items-center gap-1"><AlertCircle size={10} /> Plazo Vencido</span>
                            ) : (
                                <span className="bg-green-50 text-green-600 text-[9px] font-black px-3 py-1 rounded-lg uppercase border border-green-100">En curso</span>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-tight">
                                {evaluacion.tituloEvaluacion || evaluacion.titulo}
                            </h3>
                            <p className="text-sm text-slate-500 font-bold leading-relaxed mt-2">
                                {evaluacion.descripcionEvaluacion || evaluacion.descripcion || "Sin descripción adicional."}
                            </p>
                        </div>

                        {(evaluacion.rutaRecurso || evaluacion.recurso) && (
                            <div onClick={(e) => { e.stopPropagation(); onPreview(evaluacion.rutaRecurso || evaluacion.recurso); }} className="inline-flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white transition-all">
                                <div className="p-2 bg-white rounded-xl shadow-sm">{getFileIcon(evaluacion.rutaRecurso || evaluacion.recurso)}</div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Guía / Examen</p>
                                    <p className="text-[10px] font-black text-slate-700 uppercase">Ver Material</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECCIÓN DERECHA (FECHA Y NOTA) */}
                    <div className="flex flex-col justify-between items-end gap-4 min-w-[140px]">
                        <div className="flex gap-2">
                            {rol === "docente" && (
                                <>
                                    <button onClick={onVerEntregas} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800"><Eye size={16} /></button>
                                    <button onClick={onEditar} className="p-2.5 bg-white text-slate-400 border border-slate-100 rounded-xl hover:text-blue-600"><Edit size={16} /></button>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-6 bg-slate-50/50 p-4 rounded-[1.8rem] border border-slate-100">
                            {/* NOTA LADO A LADO */}
                            {yaEntregado && (
                                <div className="flex flex-col items-center pr-6 border-r border-slate-200">
                                    <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Nota</span>
                                    <span className={`text-sm font-black px-3 py-1 rounded-lg border ${getNotaEstilo(ultimaNota)}`}>
                                        {ultimaNota ?? "--"}
                                    </span>
                                </div>
                            )}

                            {/* FECHA LÍMITE */}
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-black text-slate-400 uppercase mb-1 italic">Fecha Límite</span>
                                <div className={`flex items-center gap-1.5 font-bold text-[11px] ${expirada ? 'text-red-500' : 'text-slate-700'}`}>
                                    <Calendar size={12} />
                                    <span>{fechaLimiteBase.toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvaluacionCard;