import React from "react";
import { useActividad } from "@/hooks/useActividad";
import DashboardProgreso from "@/components/dashboard/DashboardProgreso";
import { Loader2, TrendingUp, Award, CheckCircle } from "lucide-react";

export default function Progreso() {
    const { actividades, loading } = useActividad();

    if (loading) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                    Analizando tu rendimiento...
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto animate-fadeIn pb-24">
            <header className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-600 rounded-xl text-white">
                        <TrendingUp size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Analytics</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Mi Progreso</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Estadísticas detalladas de tu aprendizaje</p>
            </header>

            <DashboardProgreso actividades={actividades} />

            {/* lista simple dde tus mejores notas abajo */}
            <div className="mt-12">
                <h3 className="text-sm font-black text-slate-800 uppercase mb-6 flex items-center gap-2">
                    <Award size={16} className="text-amber-500" /> 
                    Mejores Calificaciones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {actividades
                    .filter(a => a.nota !== null && a.nota !== undefined && a.nota >= 18)
                    .map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white border-2 border-slate-50 rounded-[2rem]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                                        <CheckCircle size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">{item.nombreCurso}</p>
                                        <p className="text-xs font-bold text-slate-700">{item.titulo}</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-emerald-600">{item.nota}</span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}