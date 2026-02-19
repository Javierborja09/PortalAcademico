import React from "react";
import { ShieldAlert } from "lucide-react";

const AulaAccesoRestringido = ({ onBack }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 w-full">
      <div className="bg-slate-950 w-full max-w-4xl rounded-[4rem] p-20 flex flex-col items-center justify-center shadow-2xl border border-white/5 animate-fadeIn">
        <div className="p-8 bg-red-500/10 rounded-[3rem] border border-red-500/20 mb-8">
          <ShieldAlert size={80} className="text-red-500" />
        </div>
        
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl font-black uppercase text-white">
            Acceso Restringido
          </h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            No estás matriculado en este curso o no tienes permisos de
            docente.
          </p>
        </div>

        <button
          onClick={onBack}
          className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all"
        >
          Volver a mis cursos
        </button>
      </div>
    </div>
  );
};

export default AulaAccesoRestringido;