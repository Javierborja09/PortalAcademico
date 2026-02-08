import React from "react";
import {
  BookOpen,
  User,
  Settings,
  ArrowRight,
  Calendar,
  Info,
  Users,
} from "lucide-react";
import { useCursoItem } from "@/hooks/useCursoItem";
import CursoDetalle from "@/components/curso/CursoDetalle";
import CursoAdmin from "@/components/curso/CursoAdmin";
import MatriculaAdmin from "@/components/MatriculaAdmin";
import Avatar from "@/components/common/Avatar";

const CursoItem = ({ curso, rol, onRefresh }) => {
  const { modals, horarios, handleOpenDetails, handleIrAAulaVirtual } =
    useCursoItem(curso.id_curso);

  return (
    <>
      {/* TARJETA PRINCIPAL - Quitamos shadow-sm por un borde más definido */}
      <div className="bg-white p-7 rounded-[2.5rem] border border-slate-200 hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
        {/* BANNER */}
        <div className="relative w-full h-28 mb-6 overflow-hidden rounded-[1.5rem] bg-slate-100 border border-slate-200">
          <Avatar
            src={curso.imagenPortada}
            type="curso"
            className="w-full h-full group-hover:scale-105 rounded-[1.5rem] border-none"
            alt={curso.nombreCurso}
          />

          <div className="absolute top-3 left-3">
            <span className="text-[8px] font-black tracking-widest text-white bg-blue-600 px-2.5 py-1 rounded-lg uppercase">
              {curso.codigoCurso || "CURSO"}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            {rol === "admin" && (
              <button
                onClick={() => modals.matricula.set(true)}
                className="p-2 bg-slate-900/50 hover:bg-slate-900 backdrop-blur-md text-white rounded-xl transition-all border border-white/10"
              >
                <Users size={16} />
              </button>
            )}
            <button
              onClick={handleOpenDetails}
              className="p-2 bg-slate-900/50 hover:bg-blue-600 backdrop-blur-md text-white rounded-xl transition-all border border-white/10"
            >
              <Info size={16} />
            </button>
          </div>
        </div>

        {/* INFO Y CUERPO */}
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Calendar size={12} /> <span>2026-I</span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
            {curso.nombreCurso}
          </h3>

          <div className="flex items-center gap-3 mb-8 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 border border-slate-200">
              <User size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-0.5">
                Docente Titular
              </p>
              <p className="text-sm text-slate-700 font-bold leading-none">
                {curso.docente
                  ? `${curso.docente.nombre} ${curso.docente.apellido}`
                  : "Por asignar"}
              </p>
            </div>
          </div>
        </div>

        {/* ACCIÓN PRINCIPAL - SIN SOMBRAS (SHADOW REMOVED) */}
        <div className="relative z-10">
          <button
            onClick={() =>
              rol === "admin" ? modals.admin.set(true) : handleIrAAulaVirtual()
            }
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
              rol === "admin"
                ? "bg-slate-900 text-white border-slate-900 hover:bg-blue-600 hover:border-blue-600"
                : "bg-transparent text-slate-900 border-slate-900 hover:bg-slate-900 hover:text-white"
            }`}
          >
            {rol === "admin" ? <Settings size={16} /> : <BookOpen size={16} />}
            <span>{rol === "admin" ? "Gestionar Curso" : "Aula Virtual"}</span>
            {rol !== "admin" && (
              <ArrowRight
                size={16}
                className="ml-1 group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>
        </div>
      </div>

      {/* MODALES */}
      <CursoDetalle
        isOpen={modals.details.isOpen}
        onClose={() => modals.details.set(false)}
        curso={curso}
        horarios={horarios}
      />
      {rol === "admin" && (
        <>
          <CursoAdmin
            isOpen={modals.admin.isOpen}
            onClose={() => modals.admin.set(false)}
            curso={curso}
            onSave={onRefresh}
          />
          <MatriculaAdmin
            isOpen={modals.matricula.isOpen}
            onClose={() => modals.matricula.set(false)}
            curso={curso}
          />
        </>
      )}
    </>
  );
};

export default CursoItem;
