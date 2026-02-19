import React from "react";
import { Info, Users } from "lucide-react";
import Avatar from "@/components/common/Avatar";

const AulaStats = ({ curso, integrantesCount, onOpenInfo, onOpenUsers }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      {/* CARD DOCENTE */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
        <Avatar
          src={curso?.docente?.foto_perfil}
          type="perfil"
          className="w-20 h-20 rounded-3xl shadow-lg"
        />
        <div className="text-left">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Docente Titular
          </p>
          <h3 className="text-xl font-black text-slate-800 uppercase leading-none">
            {curso?.docente
              ? `${curso.docente.nombre} ${curso.docente.apellido}`
              : "Sin asignar"}
          </h3>
          <button
            onClick={onOpenInfo}
            className="mt-3 flex items-center gap-2 text-blue-600 font-bold text-[10px] hover:underline uppercase tracking-tighter"
          >
            <span className="p-1 bg-blue-50 rounded-md">
              <Info size={12} />
            </span> 
            Detalles Académicos
          </button>
        </div>
      </div>

      {/* CARD PARTICIPANTES */}
      <button
        onClick={onOpenUsers}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 hover:shadow-xl group transition-all"
      >
        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <Users size={32} />
        </div>
        <div className="text-left">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Comunidad
          </p>
          <h3 className="text-lg font-black text-slate-800 uppercase leading-none">
            Participantes
          </h3>
          <p className="text-blue-600 text-[10px] font-bold mt-1 uppercase">
            {integrantesCount} Alumnos Inscritos
          </p>
        </div>
      </button>
    </div>
  );
};

export default AulaStats;