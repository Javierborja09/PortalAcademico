import React from "react";
import { Calendar, Hash, XCircle, Eye, Users, Edit, Trash2, Send, Clock, MessageSquare } from "lucide-react";

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
    const idEval = evaluacion.id_evaluacion || evaluacion.idEvaluacion;
    const expirada = evaluacionExpirada(evaluacion.fechaLimite);
    const ultimaEntrega = entregas[0];

    const getNotaColor = (nota) => {
        if (nota === null || nota === undefined) return "text-amber-500";
        return parseFloat(nota) < 13 ? "text-red-600" : "text-emerald-600";
    };

    const getNotaBgBadge = (nota) => {
        if (nota === null || nota === undefined) return "bg-amber-50 border-amber-100 text-amber-500";
        return parseFloat(nota) < 13
            ? "bg-red-50 border-red-100 text-red-600"
            : "bg-emerald-50 border-emerald-100 text-emerald-600";
    };

    const badgeClass = "flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm text-[10px] font-black text-slate-600 uppercase";
    const btnBase = "flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all shadow-sm active:scale-95";

    return (
        <div className={`bg-white rounded-[2rem] border-2 overflow-hidden transition-all hover:shadow-2xl ${expirada ? "border-slate-100" : "border-blue-50"}`}>
            <div className={`p-6 ${expirada ? "bg-slate-50/50" : "bg-gradient-to-br from-blue-50/40 to-white"}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 space-y-3">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight">{evaluacion.tituloEvaluacion}</h3>
                            <p className="text-sm text-slate-500 font-medium">{evaluacion.descripcionEvaluacion}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <div className={badgeClass}>
                                <Calendar size={14} className="text-blue-500" /> Cierra: {new Date(evaluacion.fechaLimite).toLocaleString()}
                            </div>
                            <div className={badgeClass}>
                                <Hash size={14} className="text-indigo-500" /> {evaluacion.intentosPermitidos} Intentos
                            </div>
                            {expirada && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-xl border border-red-100 text-[10px] font-black uppercase">
                                    <XCircle size={14} /> Plazo Vencido
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Calificación Principal (Alumno) */}
                    {rol === "alumno" && ultimaEntrega && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center min-w-[120px]">
                            <div className={`${getNotaColor(ultimaEntrega.nota)} font-black text-3xl mb-1`}>
                                {ultimaEntrega.nota ?? "--"}
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-t pt-2">Calificación</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-slate-50 flex flex-wrap gap-3 items-center">
                {evaluacion.rutaRecurso && (
                    <button onClick={() => onPreview(evaluacion.rutaRecurso, evaluacion.tituloEvaluacion)} className={`${btnBase} bg-slate-900 text-white`}>
                        <Eye size={14} /> Instrucciones
                    </button>
                )}

                {rol === "docente" ? (
                    <>
                        <button onClick={() => onVerEntregas(evaluacion)} className={`${btnBase} bg-blue-600 text-white`}>
                            <Users size={14} /> Entregas
                        </button>
                        <button onClick={() => onEditar(evaluacion)} className={`${btnBase} bg-slate-100 text-slate-600 hover:bg-slate-200`}>
                            <Edit size={14} /> Editar
                        </button>
                        <button onClick={() => onEliminar(idEval)} className={`${btnBase} border border-red-100 text-red-500 hover:bg-red-50`}>
                            <Trash2 size={14} />
                        </button>
                    </>
                ) : (
                    puedeEnviar(evaluacion) ? (
                        <button onClick={() => onEnviar(evaluacion)} className={`${btnBase} bg-blue-600 text-white px-6`}>
                            <Send size={14} /> Realizar Entrega
                        </button>
                    ) : (
                        <div className="text-[10px] font-black uppercase text-slate-400 px-4 py-2 bg-slate-50 rounded-xl">
                            {expirada ? "Entrega cerrada" : "Intentos agotados"}
                        </div>
                    )
                )}
            </div>

            {/* Historial de Intentos con colores condicionales */}
            {rol === "alumno" && entregas.length > 0 && (
                <div className="px-6 pb-6">
                    <div className="bg-slate-50/50 rounded-[1.5rem] p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock size={12} className="text-slate-400" />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase">Mis Intentos</h4>
                        </div>
                       
                        <div className="grid gap-2">
                            {entregas.map((entrega) => (
                                <div key={entrega.idEntrega} className="bg-white rounded-xl p-3 flex justify-between items-center border border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-700 uppercase">Intento #{entrega.intentoNumero}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(entrega.fechaEntrega).toLocaleString()}</p>
                                       
                                    </div>

                                     {entrega.comentarioDocente && (
                                        <div className="mt-3 pt-3 border-t border-slate-50">
                                            <div className="flex gap-2 bg-blue-50/40 p-2 rounded-lg border border-blue-50/60">
                                                <MessageSquare size={12} className="text-blue-500 shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Retroalimentación</p>
                                                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                                                        "{entrega.comentarioDocente}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-right">
                                        {entrega.nota !== null ? (
                                            <span className={`text-xs font-black px-2.5 py-1 rounded-lg border uppercase ${getNotaBgBadge(entrega.nota)}`}>
                                                {entrega.nota}
                                            </span>
                                        ) : (
                                            <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 uppercase">
                                                En corrección
                                            </span>
                                        )}
                                    </div>
                                  
                                   

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvaluacionCard;