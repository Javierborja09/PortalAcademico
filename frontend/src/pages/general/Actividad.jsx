import React, { useState, useEffect } from "react";
import { useActividad } from "@/hooks/useActividad";
import EvaluacionCard from "@/components/aula/evaluacion/EvaluacionCard";
import { useNavigate } from "react-router-dom";
import { 
    Loader2, Megaphone, X, CheckCircle2, 
    ListFilter, LayoutGrid, AlertCircle, CalendarX
} from "lucide-react";

export default function Actividad() {
    const { actividades, loading } = useActividad();
    const navigate = useNavigate();
    
    const [tabActual, setTabActual] = useState("todas");
    const [anuncioSeleccionado, setAnuncioSeleccionado] = useState(null);
    const [errorVencido, setErrorVencido] = useState(null);

    useEffect(() => {
        const handleEsc = (e) => { 
            if (e.key === "Escape") {
                setAnuncioSeleccionado(null);
                setErrorVencido(null);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const actividadesFiltradas = actividades.filter(item => {
        if (tabActual === "todas") return true;
        if (item.tipo === "anuncio") return true;
        const estaEntregado = item.entregado === true || item.estado_entrega === "entregado";
        return !estaEntregado;
    });

    if (loading) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                    Organizando tu agenda...
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto animate-fadeIn pb-24">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Actividad</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Control central de tus cursos</p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200">
                    <button onClick={() => setTabActual("todas")} className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.2rem] font-black uppercase text-[10px] tracking-wider transition-all ${tabActual === "todas" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                        <LayoutGrid size={14} /> Todas
                    </button>
                    <button onClick={() => setTabActual("pendientes")} className={`flex items-center gap-2 px-6 py-2.5 rounded-[1.2rem] font-black uppercase text-[10px] tracking-wider transition-all ${tabActual === "pendientes" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                        <ListFilter size={14} /> Pendientes
                    </button>
                </div>
            </header>

            <div className="grid gap-12">
                {actividadesFiltradas.map((item, index) => {
                    const idItem = item.id_evaluacion || item.idEvaluacion || item.id_anuncio || index;
                    const keyId = `${item.tipo}-${idItem}`;
                    
                    if (item.tipo === "evaluacion") {
                        const fechaLimite = new Date(item.fecha_fin || item.fecha_limite || item.fechaLimite);
                        const estaVencida = new Date() > fechaLimite;
                        const estaEntregado = item.entregado === true || item.estado_entrega === "entregado";

                        return (
                            <div key={keyId} className="group relative">
                                <div className="flex items-center justify-between mb-4 ml-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-6 rounded-full ${estaEntregado ? 'bg-green-500' : estaVencida ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{item.nombreCurso}</span>
                                    </div>
                                    {estaEntregado && (
                                        <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-4 py-1.5 rounded-full border border-green-100">
                                            <CheckCircle2 size={12} strokeWidth={3} />
                                            <span className="text-[9px] font-black uppercase">Completado</span>
                                        </div>
                                    )}
                                </div>

                                <div
                                    onClick={() => {
                                        if (estaVencida && !estaEntregado) { setErrorVencido(item); return; }
                                        navigate(`/aula-virtual/${item.id_curso}`, { 
                                            state: { autoOpenEvalId: estaEntregado ? null : (item.id_evaluacion || item.idEvaluacion), activeTab: "evaluaciones" } 
                                        });
                                    }}
                                    className="cursor-pointer"
                                >
                                    <EvaluacionCard
                                        evaluacion={item}
                                        rol="alumno"
                                        entregas={estaEntregado ? [{ nota: item.nota }] : []}
                                    />
                                </div>
                            </div>
                        );
                    }

                    if (item.tipo === "anuncio") {
                        return (
                            <div key={keyId} className="group">
                                <div className="flex items-center gap-3 mb-4 ml-2">
                                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{item.nombreCurso}</span>
                                </div>
                                <div onClick={() => setAnuncioSeleccionado(item)} className="bg-white border-2 border-slate-100 p-8 rounded-[2.8rem] cursor-pointer hover:scale-[1.01] transition-all hover:shadow-2xl">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Megaphone size={20} /></div>
                                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">{item.titulo}</h3>
                                    </div>
                                    <p className="text-slate-500 line-clamp-2 text-sm font-bold ml-14">{item.descripcion || item.contenido}</p>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* modals de error y Anuncio se debe mantener igual*/}
            {errorVencido && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setErrorVencido(null)} />
                    <div className="relative bg-white w-full max-w-md rounded-[3.5rem] p-10 text-center z-[10000] animate-slideUp">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><CalendarX size={40} strokeWidth={2.5} /></div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Plazo Finalizado</h2>
                        <p className="text-slate-500 font-bold text-sm leading-relaxed mb-8">Lo sentimos, el plazo ha expirado.</p>
                        <button onClick={() => setErrorVencido(null)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]">Entendido</button>
                    </div>
                </div>
            )}
        </div>
    );
}