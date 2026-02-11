import React from "react";
import { Loader2, ClipboardList, Plus, X } from "lucide-react";

// Hooks
import { useEvaluaciones } from "@/hooks/useEvaluaciones";
import { useEvaluacionAdmin } from "@/hooks/useEvaluacionesAdmin";
import { useEntregaAdmin } from "@/hooks/useEntregasAdmin";

// Componentes
import EvaluacionCard from "./EvaluacionCard";
import EvaluacionModal from "./EvaluacionModal";
import EntregaModal from "../entrega/EntregaModal";
import CalificacionModal from "../entrega/CalificacionModal";
import VerEntregasModal from "../entrega/VerEntregasModal";

const AulaEvaluaciones = ({ idCurso, idAlumno, rol }) => {
  // Lógica de datos y utilidades
  const {
    evaluaciones,
    misEntregas,
    loading,
    preview,
    alumnoIdReal,
    cargarDatos,
    handlePreview,
    closePreview,
    evaluacionExpirada,
    puedeEnviar
  } = useEvaluaciones(idCurso, idAlumno, rol);

  // Hooks de administración (Modales y CRUD)
  const evAdmin = useEvaluacionAdmin(idCurso, cargarDatos);
  const enAdmin = useEntregaAdmin(alumnoIdReal, cargarDatos);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Cargando Actividades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <ClipboardList className="text-blue-600" size={28} />
          Evaluaciones y Tareas
        </h2>
        {rol === "docente" && (
          <button
            onClick={evAdmin.openCrear}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95 shadow-blue-200"
          >
            <Plus size={16} /> Nueva Evaluación
          </button>
        )}
      </div>

      {/* Lista de Evaluaciones */}
      {evaluaciones.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No hay actividades registradas</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {evaluaciones.map((evaluacion) => (
            <EvaluacionCard
              key={evaluacion.id_evaluacion || evaluacion.idEvaluacion}
              evaluacion={evaluacion}
              rol={rol}
              entregas={misEntregas[evaluacion.id_evaluacion || evaluacion.idEvaluacion] || []}
              onPreview={handlePreview}
              onVerEntregas={enAdmin.openVerEntregas}
              onEditar={evAdmin.openEditar}
              onEliminar={evAdmin.eliminar}
              onEnviar={enAdmin.openEnviar}
              evaluacionExpirada={evaluacionExpirada}
              puedeEnviar={puedeEnviar}
            />
          ))}
        </div>
      )}

      {/* --- MODALES --- */}

      {/* Previsualización de PDF */}
      {preview.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase truncate">{preview.titulo}</h3>
              <button onClick={closePreview} className="p-2 hover:bg-red-50 text-slate-500 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 relative min-h-[500px]">
              {preview.url && (
                <iframe
                  src={`${preview.url}#view=FitH`}
                  title={preview.titulo}
                  className="absolute inset-0 w-full h-full border-none bg-white"
                  type="application/pdf"
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center -z-10">
                <Loader2 className="animate-spin text-blue-600 mb-2" />
                <p className="text-slate-400 text-[10px] font-black uppercase">Cargando visor...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modales CRUD Evaluación */}
      {evAdmin.modal.isOpen && (
        <EvaluacionModal
          isOpen={true} type={evAdmin.modal.type} form={evAdmin.form}
          setForm={evAdmin.setForm} loading={evAdmin.loading}
          onClose={evAdmin.closeModal} onSubmit={evAdmin.handleSubmit}
        />
      )}

      {/* Modales Entregas y Calificaciones */}
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
              onCalificar={enAdmin.openCalificar} onPreview={handlePreview}
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