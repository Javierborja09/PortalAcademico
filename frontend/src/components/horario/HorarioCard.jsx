import React from 'react';
import { Clock, MapPin } from 'lucide-react';

const HorarioCard = ({ horario }) => {
    const inicialesDia = horario.diaSemana.substring(0, 2).toUpperCase();
    const formatoHora = (hora) => hora.substring(0, 5);

    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 hover:bg-white transition-all duration-300">
            <div className="flex items-center gap-4">
                {/* Icono del Día */}
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm font-black text-xs border border-slate-50 group-hover:scale-110 transition-transform">
                    {inicialesDia}
                </div>

                {/* Info de Tiempo */}
                <div>
                    <p className="text-sm font-black text-slate-800 capitalize">
                        {horario.diaSemana.toLowerCase()}
                    </p>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                        <Clock size={12} className="text-blue-400" />
                        <span>{formatoHora(horario.horaInicio)} - {formatoHora(horario.horaFin)}</span>
                    </div>
                </div>
            </div>

            {/* Ubicación / Aula */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-tight shadow-sm">
                <MapPin size={10} className="text-slate-400" />
                {horario.aula}
            </div>
        </div>
    );
};

export default HorarioCard;