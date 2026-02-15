import React from "react";
import { X, Send, Loader2, MessageSquare, Upload } from "lucide-react";

const EntregaModal = ({
  isOpen,
  evaluacion,
  form,
  setForm,
  loading,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, archivo: file });
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl"
        onClick={onClose}
      />

      <form
        onSubmit={onSubmit}
        className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto"
      >
        <header className="bg-blue-600 p-8 text-white flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              Enviar Tarea
            </h2>
            <p className="text-blue-200 text-sm font-bold mt-1">
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

        <div className="p-10 space-y-6">
          {/* Información de la evaluación */}
          <div className="bg-slate-50 rounded-2xl p-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Fecha Límite
              </span>
              <span className="text-sm font-bold text-slate-700">
                {evaluacion?.fechaLimite ? new Date(evaluacion.fechaLimite).toLocaleString() : "No especificada"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Intentos Permitidos
              </span>
              <span className="text-sm font-bold text-slate-700">
                {evaluacion?.intentosPermitidos || 1}
              </span>
            </div>
          </div>

          {/* Contenido de texto */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2">
              <MessageSquare size={14} />
              Respuesta Escrita (Opcional)
            </label>
            <textarea
              rows="6"
              value={form.texto}
              onChange={(e) => setForm({ ...form, texto: e.target.value })}
              className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-medium text-slate-700 resize-none"
              placeholder="Escribe tu respuesta aquí..."
            />
          </div>

          {/* Archivo adjunto */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2">
              <Upload size={14} />
              Archivo Adjunto 
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full pl-4 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {form.archivo && (
              <p className="text-xs text-slate-500 ml-2 flex items-center gap-2">
                ✓ Archivo seleccionado: <strong>{form.archivo.name}</strong>
              </p>
            )}
          </div>

          {/* Advertencia */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs text-amber-800 font-medium">
              ⚠️ <strong>Importante:</strong> Asegúrate de revisar tu trabajo antes de enviarlo. 
              Una vez enviado, se contará como un intento.
            </p>
          </div>
        </div>

        <div className="p-10 pt-0">
          <button
            disabled={loading || (!form.texto && !form.archivo)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
            Enviar Tarea
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntregaModal;