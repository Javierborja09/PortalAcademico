import React, { useState, useEffect } from "react";
import { X, Loader2, Award, Clock, Download, Eye } from "lucide-react";
import EntregaService from "@/services/entregaService";

const VerEntregasModal = ({
  isOpen,
  evaluacion,
  onClose,
  onCalificar,
  onPreview,
}) => {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && evaluacion) {
      cargarEntregas();
    }
  }, [isOpen, evaluacion]);

  const cargarEntregas = async () => {
    setLoading(true);
    try {
      const data = await EntregaService.verTodasLasEntregas(evaluacion.id_evaluacion);
      setEntregas(data);
    } catch (error) {
      console.error("Error al cargar entregas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl animate-slideUp max-h-[90vh] flex flex-col">

        {/* Header */}
        <header className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              Entregas Recibidas
            </h2>
            <p className="text-blue-400 text-sm font-bold mt-1">
              {evaluacion?.tituloEvaluacion}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <p className="text-slate-400 font-bold text-sm">Cargando entregas...</p>
            </div>
          ) : entregas.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 font-bold">
                Aún no hay entregas para esta evaluación
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entregas.map((entrega) => (
                <div
                  key={entrega.idEntrega || `${entrega.idAlumno}-${entrega.intentoNumero}`}
                  className="bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Perfil Estudiante */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">
                          {entrega.nombreAlumno?.charAt(0)}
                          {entrega.apellidoAlumno?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800">
                            {entrega.nombreAlumno} {entrega.apellidoAlumno}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-2">
                            <Clock size={12} />
                            {entrega.fechaEntrega
                              ? new Date(entrega.fechaEntrega).toLocaleString()
                              : "Sin fecha"}
                          </p>
                        </div>
                      </div>

                      {/* Texto de la entrega */}
                      {entrega.contenidoTexto && (
                        <p className="text-sm text-slate-600 bg-white rounded-xl p-4 line-clamp-3 border border-slate-100">
                          {entrega.contenidoTexto}
                        </p>
                      )}

                      {/* Archivo */}

                      {entrega.rutaArchivo && (
                        <button
                          onClick={() => onPreview(entrega.rutaArchivo, `Entrega: ${entrega.nombreAlumno}`)}
                          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all hover:bg-slate-800 shadow-lg active:scale-95"
                        >
                          <Eye size={14} /> Documento Adjunto
                        </button>
                      )}

                      {/* Info adicional */}
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                          Intento #{entrega.intentoNumero || 1}
                        </span>
                      </div>
                    </div>

                    {/* Acciones y Calificación */}
                    <div className="flex flex-col items-end gap-2">
                      {entrega.nota !== null && entrega.nota !== undefined ? (
                        <div className={`px-4 py-2 rounded-xl font-black text-lg border ${parseFloat(entrega.nota) < 13 ? "bg-red-50 border-red-100 text-red-600"
                          : "bg-emerald-50 border-emerald-100 text-emerald-600"
                          }`}>
                          {entrega.nota}
                        </div>
                      ) : (
                        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold text-[10px] uppercase">
                          Sin calificar
                        </div>
                      )}

                      <button
                        onClick={() => {
                          onCalificar(entrega);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase transition-all flex items-center gap-2 shadow-lg shadow-blue-200 active:scale-95"
                      >
                        <Award size={14} />
                        {entrega.nota !== null ? "Editar" : "Calificar"}
                      </button>
                    </div>
                  </div>

                  {/* Comentario Docente */}
                  {entrega.comentarioDocente && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
                        Tu Retroalimentación
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        "{entrega.comentarioDocente}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerEntregasModal;