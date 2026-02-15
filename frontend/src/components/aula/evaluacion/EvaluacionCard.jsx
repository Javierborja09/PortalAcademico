import React from "react";
import {
    Calendar, Eye, Edit, Trash2, Send, FileText,
    FileArchive, FileCode, File, Clock, MessageSquare
} from "lucide-react";

const EvaluacionCard = ({
    evaluacion,
    rol,
    entregas,
    onPreview,
    onVerEntregas,
    onEditar,
    onEliminar,
    onEnviar,
    evaluacionExpirada,
    puedeEnviar
}) => {
    const expirada = evaluacionExpirada(evaluacion.fechaLimite);
    const ultimaNota = entregas.length > 0 ? entregas[0].nota : null;

    // Colores de notas dinámicos
    const getNotaBgBadge = (nota) => {
        if (nota === null || nota === undefined) return "bg-amber-50 border-amber-100 text-amber-500";
        return parseFloat(nota) < 13
            ? "bg-red-50 border-red-100 text-red-600"
            : "bg-emerald-50 border-emerald-100 text-emerald-600";
    };

    // Estándar de iconos de archivos
    const getFileIcon = (filename) => {
        const ext = filename?.toLowerCase() || "";
        if (ext.endsWith(".pdf")) return <FileText className="text-red-500" size={16} />;
        if (ext.match(/\.(jpg|jpeg|png|webp|gif)$/)) return <FileText className="text-emerald-500" size={16} />;
        if (ext.match(/\.(zip|rar|7z)$/)) return <FileArchive className="text-amber-500" size={16} />;
        if (ext.match(/\.(txt|doc|docx)$/)) return <FileCode className="text-blue-500" size={16} />;
        return <File className="text-slate-500" size={16} />;
    };

    return (
        <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
            <div className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">

                    {/* INFORMACIÓN PRINCIPAL */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase border border-blue-100">
                                Evaluación
                            </span>
                            {expirada && (
                                <span className="bg-red-50 text-red-600 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase border border-red-100">
                                    Plazo Vencido
                                </span>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                {evaluacion.tituloEvaluacion}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                                {evaluacion.descripcionEvaluacion || "Sin descripción adicional."}
                            </p>
                        </div>

                        {/* RECURSO ADJUNTO DEL DOCENTE */}
                        {evaluacion.rutaRecurso && (
                            <div
                                onClick={() => onPreview(evaluacion.rutaRecurso, evaluacion.tituloEvaluacion)}
                                className="inline-flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-blue-50/50 transition-colors group/file"
                            >
                                <div className="p-2 bg-white rounded-xl shadow-sm group-hover/file:scale-110 transition-transform">
                                    {getFileIcon(evaluacion.rutaRecurso)}
                                </div>
                                <div className="pr-4">
                                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Guía / Examen</p>
                                    <p className="text-[10px] font-bold text-slate-700 uppercase truncate max-w-[150px]">Ver Material</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ACCIONES, CALIFICACIÓN Y FECHA LÍMITE */}
                    <div className="flex flex-col justify-between items-end gap-4 shrink-0">

                        {/* BOTONES DE ACCIÓN */}
                        <div className="flex gap-1.5">
                            {rol === "docente" ? (
                                <>
                                    <button onClick={onVerEntregas} title="Ver Entregas" className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                                        <Eye size={16} />
                                    </button>
                                    <button onClick={onEditar} title="Editar" className="p-2.5 bg-white text-slate-400 border border-slate-100 rounded-xl hover:text-blue-600 transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={onEliminar} title="Eliminar" className="p-2.5 bg-white text-slate-400 border border-slate-100 rounded-xl hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            ) : (
                                !expirada && puedeEnviar(evaluacion) && (
                                    <button
                                        onClick={onEnviar}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                                    >
                                        <Send size={14} /> Entregar Tarea
                                    </button>
                                )
                            )}
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            {/* CALIFICACIÓN FINAL (Integrada en el flujo para evitar sobreposición) */}
                            {rol === "alumno" && (entregas.length > 0) && (
                                <div className="animate-fadeIn">
                                    {ultimaNota !== null ? (
                                        <div className="text-right flex flex-col items-end">
                                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1 tracking-widest">Calificación Final</p>
                                            <span className={`text-2xl font-black px-5 py-2 rounded-2xl border-2 uppercase shadow-sm ${getNotaBgBadge(ultimaNota)}`}>
                                                {ultimaNota}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1 tracking-widest">Estado</p>
                                            <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 uppercase shadow-sm">
                                                En corrección
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}


                        </div>

                        {/* FECHA LÍMITE */}
                        <div className="text-right space-y-1">
                            <p className="text-[8px] font-black text-slate-300 uppercase italic leading-none">Fecha Límite</p>
                            <div className="flex items-center justify-end gap-1.5 text-slate-600">
                                <Calendar size={12} className="text-blue-500" />
                                <span className="text-[10px] font-bold">
                                    {new Date(evaluacion.fechaLimite).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HISTORIAL DE ENTREGAS */}
                {rol === "alumno" && entregas.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock size={12} className="text-slate-400" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mis Entregas Realizadas</p>
                        </div>
                        <div className="space-y-3">
                            {entregas.map((entrega) => (
                                <div key={entrega.id_entrega} className="bg-slate-50/30 rounded-[1.5rem] border border-slate-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="flex items-center gap-3 cursor-pointer group/item"
                                            onClick={() => onPreview(`/submissions${entrega.rutaArchivo}`, "Mi Entrega")}
                                        >
                                            <div className="p-2 bg-white rounded-lg shadow-sm group-hover/item:text-blue-600 transition-colors">
                                                {getFileIcon(entrega.rutaArchivo)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-700 uppercase">Intento #{entrega.intentoNumero}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase leading-tight">Archivo Enviado</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">
                                                    {new Date(entrega.fechaEntrega).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {entrega.nota !== null ? (
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Calificación</p>
                                                    <span className={`text-xs font-black px-3 py-1 rounded-lg border uppercase ${getNotaBgBadge(entrega.nota)}`}>
                                                        {entrega.nota}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 uppercase">
                                                    En corrección
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {entrega.comentarioDocente && (
                                        <div className="mt-3 p-3 bg-white rounded-xl border border-slate-100 flex gap-3">
                                            <MessageSquare size={14} className="text-blue-400 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-slate-600 font-medium leading-relaxed italic">
                                                "{entrega.comentarioDocente}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvaluacionCard;