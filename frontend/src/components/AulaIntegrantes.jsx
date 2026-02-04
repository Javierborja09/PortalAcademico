import React from "react";
import { Users, Mail } from "lucide-react";

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
        <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Integrantes
            </h2>
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Lista de clase
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
          >
            <Users size={20} />
          </button>
        </div>
        <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
          {integrantes.map((alumno) => (
            <div
              key={alumno.id_usuario}
              className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group"
            >
              <img
                src={
                  alumno.foto_perfil
                    ? `http://localhost:8080${alumno.foto_perfil}`
                    : null
                }
                className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-sm group-hover:scale-110 transition-transform bg-slate-100"
                alt="Perfil"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "http://localhost:8080/uploads/profiles/default.png";
                }}
              />
              <div className="flex-1">
                <p className="text-lg font-black text-slate-800 leading-none mb-1">
                  {alumno.nombre} {alumno.apellido}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                  <Mail size={12} className="text-blue-500" /> {alumno.correo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AulaIntegrantes;
