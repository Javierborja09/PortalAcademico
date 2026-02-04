import React from 'react';
import { User as UserIcon, ShieldCheck } from 'lucide-react';
import { useParticipantes } from '../hooks/useParticipantes';

const AulaSesionParticipantes = ({ cursoId }) => {
    const { participantes, usuarioNombreActual, totalConectados } = useParticipantes(cursoId);

    return (
        <div className="flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
            {/* Header con contador dinámico */}
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                    Participantes ({totalConectados})
                </h3>
                <div className="px-2 py-1 bg-blue-500 rounded-lg text-[10px] font-bold animate-pulse">
                    En Vivo
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
                {/* Bloque: Usuario Actual */}
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 border-2 border-indigo-200 shadow-sm">
                        <UserIcon size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] font-black text-slate-800 uppercase truncate">
                            {usuarioNombreActual} (Tú)
                        </p>
                        <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest italic">
                            Conectado
                        </span>
                    </div>
                </div>

                <div className="h-px bg-slate-200 my-2 mx-4 opacity-50" />

                {/* Lista: Otros participantes */}
                {participantes.length === 0 ? (
                    <p className="text-center py-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-50">
                        No hay otros usuarios
                    </p>
                ) : (
                    participantes.map((p, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 animate-fadeIn hover:border-indigo-200 transition-all">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm">
                                <UserIcon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black text-slate-800 uppercase truncate">
                                    {p.nombre}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">En línea</span>
                                </div>
                            </div>
                            {p.rol === 'docente' && (
                                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600" title="Docente">
                                    <ShieldCheck size={14} />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AulaSesionParticipantes;