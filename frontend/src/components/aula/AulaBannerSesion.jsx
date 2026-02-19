import React from "react";
import { Video, Play } from "lucide-react";

const AulaBannerSesion = ({ sesionActiva, rol, handleActionSesion }) => {
  return (
    <div
      className={`mb-10 rounded-[3rem] p-1 border shadow-2xl overflow-hidden relative transition-all duration-700 ${
        sesionActiva 
          ? "bg-emerald-950 border-emerald-500/30" 
          : "bg-slate-900 border-white/5"
      }`}
    >
      {sesionActiva && (
        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
      )}
      
      <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
        <div className="flex items-center gap-6">
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shadow-lg ${
              sesionActiva ? "bg-emerald-500" : "bg-white/10"
            }`}
          >
            <Video size={36} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
              {sesionActiva ? "¡Clase en vivo!" : "Videoconferencia"}
            </h2>
            <p
              className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${
                sesionActiva ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {sesionActiva
                ? "Hay una sesión activa"
                : "Esperando inicio de clase"}
            </p>
          </div>
        </div>

        <button
          onClick={handleActionSesion}
          disabled={rol === "alumno" && !sesionActiva}
          className={`px-8 py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 ${
            rol === "docente" || sesionActiva
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-white/5 text-white/20 cursor-not-allowed"
          }`}
        >
          {rol === "docente"
            ? sesionActiva
              ? "Reingresar"
              : "Iniciar Clase"
            : sesionActiva
            ? "Unirse ahora"
            : "Cerrada"}{" "}
          <Play size={14} />
        </button>
      </div>
    </div>
  );
};

export default AulaBannerSesion;