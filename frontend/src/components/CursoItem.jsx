import React from "react";
import {
  BookOpen,
  User,
  Settings,
  ArrowRight,
  Calendar,
  Info,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import { useCursoItem } from "../hooks/useCursoItem";
import CursoDetalle from "./CursoDetalle";
import CursoAdmin from "../pages/admin/CursoAdmin";
import MatriculaAdmin from "../pages/admin/MatriculaAdmin";
import Avatar from './common/Avatar';
const CursoItem = ({ curso, rol, onRefresh }) => {
  const { modals, horarios, handleOpenDetails, handleIrAAulaVirtual } =
    useCursoItem(curso.id_curso);

  return (
    <>
      <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group relative overflow-hidden">
        {/* BANNER CON FALLBACK */}
        <div className="relative w-full h-28 mb-6 overflow-hidden rounded-[1.5rem] bg-slate-100 border border-slate-100">
          <Avatar
            src={curso.imagenPortada}
            type="curso"
            className="w-full h-full group-hover:scale-105 rounded-[1.5rem] border-none shadow-none"
            alt={curso.nombreCurso}
          />
          <div className="absolute top-3 left-3">
            <span className="text-[8px] font-black tracking-widest text-white bg-blue-600/80 backdrop-blur-md px-2.5 py-1 rounded-lg uppercase">
              {curso.codigoCurso || "CURSO"}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            {rol === "admin" && (
              <button
                onClick={() => modals.matricula.set(true)}
                className="p-2 bg-white/20 hover:bg-white backdrop-blur-md text-white hover:text-indigo-600 rounded-xl transition-all border border-white/10 shadow-lg"
              >
                <Users size={16} />
              </button>
            )}
            <button
              onClick={handleOpenDetails}
              className="p-2 bg-white/20 hover:bg-white backdrop-blur-md text-white hover:text-blue-600 rounded-xl transition-all border border-white/10 shadow-lg"
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

          <div className="flex items-center gap-3 mb-8 bg-slate-50/80 p-3 rounded-2xl border border-slate-100/50">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
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

        {/* ACCIÓN PRINCIPAL */}
        <div className="relative z-10">
          <button
            onClick={() =>
              rol === "admin" ? modals.admin.set(true) : handleIrAAulaVirtual()
            }
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              rol === "admin"
                ? "bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200"
                : "bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white"
            }`}
          >
            {rol === "admin" ? <Settings size={16} /> : <BookOpen size={16} />}
            <span>{rol === "admin" ? "Gestionar Curso" : "Aula Virtual"}</span>
            {rol !== "admin" && (
              <ArrowRight
                size={16}
                className="ml-1 group-hover/btn:translate-x-1 transition-transform"
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
