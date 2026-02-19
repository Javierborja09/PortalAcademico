import React from "react";
import { X, Save, Loader2, Award, MessageCircle } from "lucide-react";

const CalificacionModal = ({
  isOpen,
  entrega,
  form,
  setForm,
  loading,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Content */}
      <form
        onSubmit={onSubmit}
        className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-slideUp max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <header className="bg-emerald-600 p-8 text-white flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              Calificar Entrega
            </h2>
            <p className="text-emerald-200 text-sm font-bold mt-1">
              {entrega?.nombreAlumno} {entrega?.apellidoAlumno}
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

        {/* Body (Scrollable) */}
        <div className="p-10 space-y-6 overflow-y-auto">
          {/* Información del alumno */}
          <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Estudiante
              </span>
              <span className="text-sm font-bold text-slate-700">
                {entrega?.nombreAlumno} {entrega?.apellidoAlumno}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Fecha de Entrega
              </span>
              <span className="text-sm font-bold text-slate-700">
                {entrega?.fechaEntrega
                  ? new Date(entrega.fechaEntrega).toLocaleString()
                  : "No especificada"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Intento Número
              </span>
              <span className="text-sm font-bold text-slate-700">
                {entrega?.intentoNumero || 1}
              </span>
            </div>
          </div>

          {/* Respuesta de texto */}
          {entrega?.contenidoTexto && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                Respuesta del Estudiante
              </label>
              <div className="bg-slate-50 rounded-2xl p-6">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {entrega.contenidoTexto}
                </p>
              </div>
            </div>
          )}


          {/* Nota */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2">
              <Award size={14} />
              Nota (0-20) *
            </label>
            <div className="relative">
              <input
                required
                type="number"
                min="0"
                max="20"
                step="0.01"
                value={form.nota}
                onChange={(e) => setForm({ ...form, nota: e.target.value })}
                className="w-full px-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700 text-center text-2xl"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Comentario */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2">
              <MessageCircle size={14} />
              Comentario para el Estudiante (Opcional)
            </label>
            <textarea
              rows="4"
              value={form.comentario}
              onChange={(e) => setForm({ ...form, comentario: e.target.value })}
              className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-medium text-slate-700 resize-none"
              placeholder="Retroalimentación para el estudiante..."
            />
          </div>
        </div>

        {/* Footer con Botón */}
        <div className="p-10 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Guardar Calificación
          </button>
        </div>
      </form>
    </div>
  );
};

export default CalificacionModal;