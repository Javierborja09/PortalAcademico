import React from "react";
import { Users, Mail, X } from "lucide-react";
import Avatar from "@/components/common/Avatar";

const AulaIntegrantes = ({ isOpen, onClose, integrantes }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Integrantes
            </h2>
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Lista de clase · {integrantes.length} alumnos
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-2xl transition-all group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Lista de Alumnos */}
        <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
          {integrantes.length > 0 ? (
            integrantes.map((alumno) => (
              <div
                key={alumno.id_usuario}
                className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group"
              >
                {/* USAMOS EL COMPONENTE GLOBAL AVATAR */}
                <Avatar
                  src={alumno.foto_perfil}
                  type="perfil"
                  alt={`${alumno.nombre} ${alumno.apellido}`}
                  className="w-14 h-14 rounded-full group-hover:scale-110"
                />

                <div className="flex-1">
                  <p className="text-lg font-black text-slate-800 leading-none mb-1 group-hover:text-blue-600 transition-colors">
                    {alumno.nombre} {alumno.apellido}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                    <Mail size={12} className="text-blue-500" /> {alumno.correo}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <Users size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                No hay integrantes matriculados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AulaIntegrantes;