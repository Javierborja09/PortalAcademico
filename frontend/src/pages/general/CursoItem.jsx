import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Importar useNavigate
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
import api from "../../api/axiosConfig";
import CursoDetalle from "./CursoDetalle";
import CursoAdmin from "./../../pages/admin/CursoAdmin";
import MatriculaAdmin from "./../admin/MatriculaAdmin";

const CursoItem = ({ curso, rol, onRefresh }) => {
  const navigate = useNavigate(); // 2. Inicializar el hook
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMatriculaOpen, setIsMatriculaOpen] = useState(false);
  const [horarios, setHorarios] = useState([]);

  const handleOpenDetails = async () => {
    try {
      const response = await api.get(`/horarios/curso/${curso.id_curso}`);
      setHorarios(response.data);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error("Error al cargar horarios del curso", error);
    }
  };

  // 3. Función para navegar al aula virtual
  const handleIrAAulaVirtual = () => {
    navigate(`/aula-virtual/${curso.id_curso}`);
  };

  return (
    <>
      <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group relative overflow-hidden">
        
        {/* SECCIÓN DE IMAGEN BANNER */}
        <div className="relative w-full h-28 mb-6 overflow-hidden rounded-[1.5rem] bg-slate-100 border border-slate-100">
          {curso.imagenPortada ? (
            <img
              src={`http://localhost:8080${curso.imagenPortada}`}
              alt={curso.nombreCurso}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.src = "http://localhost:8080/courses/default.webp";
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-300">
              <ImageIcon size={24} />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />

          {/* Badge de Código */}
          <div className="absolute top-3 left-3">
            <span className="text-[8px] font-black tracking-widest text-white bg-blue-600/80 backdrop-blur-md px-2.5 py-1 rounded-lg uppercase border border-white/10">
              {curso.codigoCurso || "CURSO"}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            {rol === "admin" && (
              <button
                onClick={() => setIsMatriculaOpen(true)}
                className="p-2 bg-white/20 hover:bg-white backdrop-blur-md text-white hover:text-indigo-600 rounded-xl transition-all duration-300 border border-white/10 shadow-lg"
                title="Gestionar Alumnos Matriculados"
              >
                <Users size={16} />
              </button>
            )}

            <button
              onClick={handleOpenDetails}
              className="p-2 bg-white/20 hover:bg-white backdrop-blur-md text-white hover:text-blue-600 rounded-xl transition-all duration-300 border border-white/10 shadow-lg"
              title="Ver detalles del curso"
            >
              <Info size={16} />
            </button>
          </div>
        </div>

        {/* INFO SUPERIOR */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <Calendar size={12} />
            <span>2026-I</span>
          </div>
        </div>

        {/* TÍTULO Y DOCENTE */}
        <div className="flex-1 relative z-10">
          <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
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

        {/* BOTÓN DE ACCIÓN PRINCIPAL ACTUALIZADO */}
        <div className="relative z-10">
          {rol === "admin" ? (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200 hover:shadow-blue-500/30"
            >
              <Settings size={16} className="group-hover:rotate-45 transition-transform" />
              <span>Gestionar Curso</span>
            </button>
          ) : (
            <button 
              onClick={handleIrAAulaVirtual} // Asignar la función de navegación
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white shadow-sm group/btn"
            >
              <BookOpen size={16} />
              <span>Aula Virtual</span>
              <ArrowRight
                size={16}
                className="ml-1 group-hover/btn:translate-x-1 transition-transform"
              />
            </button>
          )}
        </div>
      </div>

      <CursoDetalle isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} curso={curso} horarios={horarios} />

      {rol === "admin" && (
        <>
          <CursoAdmin isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} curso={curso} onSave={onRefresh} />
          <MatriculaAdmin isOpen={isMatriculaOpen} onClose={() => setIsMatriculaOpen(false)} curso={curso} />
        </>
      )}
    </>
  );
};

export default CursoItem;