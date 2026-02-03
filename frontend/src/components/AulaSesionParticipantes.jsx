import React, { useState, useEffect } from 'react';
import { User as UserIcon, ShieldCheck, Users } from 'lucide-react';
import sesionService from '../services/sesionService';

const AulaSesionParticipantes = ({ cursoId }) => {
    const [participantes, setParticipantes] = useState([]);

    useEffect(() => {
        // Suscribirse al mismo tópico para ver quiénes están notificando presencia
        const client = sesionService.client;
        if (client && client.connected) {
            const sub = client.subscribe(`/topic/curso/${cursoId}`, (payload) => {
                const msg = JSON.parse(payload.body);
                if (msg.tipo === 'PRESENCE_UPDATE' || msg.tipo === 'JOIN') {
                    setParticipantes(prev => {
                        // Evitar duplicados por nombre
                        if (prev.find(p => p.nombre === msg.remitente)) return prev;
                        return [...prev, { nombre: msg.remitente, rol: msg.rol }];
                    });
                }
            });
            return () => sub.unsubscribe();
        }
    }, [cursoId]);

    return (
        <div className="flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
            <div className="bg-slate-900 p-5 text-white">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Participantes ({participantes.length + 1})</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
                {/* Usuario actual (Tú) */}
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 flex-shrink-0 border-2 border-indigo-200">
                        <UserIcon size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] font-black text-slate-800 uppercase truncate">Tú (Actual)</p>
                        <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">En línea</span>
                    </div>
                </div>

                {/* Otros participantes */}
                {participantes.map((p, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 animate-fadeIn">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0 border-2 border-white shadow-sm">
                            <UserIcon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black text-slate-800 uppercase truncate">{p.nombre}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">En línea</span>
                            </div>
                        </div>
                        {p.rol === 'docente' && <ShieldCheck size={14} className="text-blue-600" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AulaSesionParticipantes;