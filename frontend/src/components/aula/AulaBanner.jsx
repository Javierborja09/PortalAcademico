import React from "react";
import Avatar from "@/components/common/Avatar";

const AulaBanner = ({ curso }) => {
  return (
    <div className="relative w-full h-56 md:h-80 lg:h-96 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl mb-8 md:mb-12 border-4 md:border-8 border-white group">
      
      {/* USAMOS EL COMPONENTE GLOBAL AVATAR */}
      <Avatar
        src={curso?.imagenPortada}
        type="curso"
        alt="Banner del curso"
        className="w-full h-full group-hover:scale-105 border-none shadow-none transition-transform duration-1000 bg-slate-800"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

      {/* Contenido centrado y ajustado para móvil */}
      <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <span className="bg-blue-600 text-white text-[8px] md:text-[10px] font-black px-3 md:px-5 py-1.5 md:py-2 rounded-full uppercase tracking-[0.2em] border border-blue-400/30 backdrop-blur-md">
            {curso?.codigoCurso || "CÓDIGO"}
          </span>
          <span className="bg-white/10 backdrop-blur-md text-white text-[8px] md:text-[10px] font-black px-3 md:px-5 py-1.5 md:py-2 rounded-full uppercase tracking-[0.2em] border border-white/10">
            Ciclo 2026-I
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight md:leading-none uppercase drop-shadow-2xl break-words">
          {curso?.nombreCurso}
        </h1>
      </div>
    </div>
  );
};

export default AulaBanner;