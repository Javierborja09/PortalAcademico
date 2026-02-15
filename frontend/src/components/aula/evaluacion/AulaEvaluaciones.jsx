import React, { useState } from "react";
import { Loader2, ClipboardList, Plus, BookOpen } from "lucide-react";

// Hooks
import { useEvaluaciones } from "@/hooks/useEvaluaciones";
import { useEvaluacionAdmin } from "@/hooks/useEvaluacionesAdmin";
import { useEntregaAdmin } from "@/hooks/useEntregasAdmin";

// Componentes
import EvaluacionCard from "@/components/aula/evaluacion/EvaluacionCard";
import EvaluacionModal from "@/components/aula/evaluacion/EvaluacionModal";
import EntregaModal from "@/components/aula/entrega/EntregaModal";
import CalificacionModal from "@/components/aula/entrega/CalificacionModal";
import VerEntregasModal from "@/components/aula/entrega/VerEntregasModal";
import FilePreviewModal from "@/components/aula/contenido/FilePreviewModal";

const AulaEvaluaciones = ({ idCurso, idAlumno, rol }) => {
  const {
    evaluaciones,
    misEntregas,
    loading,
    alumnoIdReal,
    cargarDatos,
    evaluacionExpirada,
    puedeEnviar
  } = useEvaluaciones(idCurso, idAlumno, rol);

  const evAdmin = useEvaluacionAdmin(idCurso, cargarDatos);
  const enAdmin = useEntregaAdmin(alumnoIdReal, cargarDatos);

  const [filePreview, setFilePreview] = useState({ isOpen: false, file: null });
  
  const handleOpenPreview = (ruta, titulo) => {
    setFilePreview({
      isOpen: true,
      file: {
        rutaArchivo: ruta,
        tituloDocumento: titulo
      }
    });
  };


  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Sincronizando Actividades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* Header con botón Crear (Solo Docente) */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <ClipboardList size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase text-slate-800 tracking-tight">Evaluaciones</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Gestión de calificaciones y entregas</p>
          </div>
        </div>

        {rol === "docente" && (
          <button
            onClick={evAdmin.openCrear}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all shadow-md active:scale-95"
          >
            <Plus size={14} /> Nueva Evaluación
          </button>
        )}
      </div>

      {/* Lista de Evaluaciones */}
      <div className="grid grid-cols-1 gap-4">
        {evaluaciones.length > 0 ? (
          evaluaciones.map((evaluacion) => (
            <EvaluacionCard
              key={evaluacion.id_evaluacion || evaluacion.idEvaluacion}
              evaluacion={evaluacion}
              rol={rol}
              entregas={misEntregas[evaluacion.id_evaluacion || evaluacion.idEvaluacion] || []}
              onPreview={handleOpenPreview}
              onVerEntregas={() => enAdmin.openVerEntregas(evaluacion)}
              onEditar={() => evAdmin.openEditar(evaluacion)}
              onEliminar={() => evAdmin.eliminar(evaluacion.id_evaluacion || evaluacion.idEvaluacion)}
              onEnviar={() => enAdmin.openEnviar(evaluacion)}
              evaluacionExpirada={evaluacionExpirada}
              puedeEnviar={puedeEnviar}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase italic">No hay evaluaciones programadas</p>
          </div>
        )}
      </div>

      {/* MODAL DE PREVISUALIZACIÓN (REUTILIZADO) */}
      {filePreview.isOpen && (
        <FilePreviewModal
          isOpen={filePreview.isOpen}
          file={filePreview.file}
          onClose={() => setFilePreview({ isOpen: false, file: null })}
        />
      )}

      {/* Modales Administrativos */}
      {evAdmin.modal.isOpen && (
        <EvaluacionModal
          isOpen={true} type={evAdmin.modal.type} form={evAdmin.form}
          setForm={evAdmin.setForm} loading={evAdmin.loading}
          onClose={evAdmin.closeModal} onSubmit={evAdmin.handleSubmit}
        />
      )}

      {enAdmin.modal.isOpen && (
        <>
          {enAdmin.modal.type === "enviar" && (
            <EntregaModal
              isOpen={true} evaluacion={enAdmin.modal.data} form={enAdmin.entregaForm}
              setForm={enAdmin.setEntregaForm} loading={enAdmin.loading}
              onClose={enAdmin.closeModal} onSubmit={enAdmin.handleEnviarTarea}
            />
          )}
          {enAdmin.modal.type === "ver-entregas" && (
            <VerEntregasModal
              isOpen={true} evaluacion={enAdmin.modal.data} onClose={enAdmin.closeModal}
              onCalificar={enAdmin.openCalificar}
              onPreview={(ruta, titulo) => handleOpenPreview(ruta, titulo)}
            />
          )}
          {enAdmin.modal.type === "calificar" && (
            <CalificacionModal
              isOpen={true} entrega={enAdmin.modal.data} form={enAdmin.calificarForm}
              setForm={enAdmin.setCalificarForm} loading={enAdmin.loading}
              onClose={enAdmin.closeModal} onSubmit={enAdmin.handleCalificar}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AulaEvaluaciones;