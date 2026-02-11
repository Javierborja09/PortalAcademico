import React from "react";
import { X, Save, Loader2, FileText, Calendar, Hash, Upload } from "lucide-react";

const EvaluacionModal = ({
  isOpen,
  type,
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
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      <form
        onSubmit={onSubmit}
        className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto"
      >
        <header className="bg-slate-900 p-8 text-white flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              {type === "crear" ? "Crear" : "Editar"} Evaluación
            </h2>
            <p className="text-blue-400 text-[9px] font-bold uppercase tracking-widest mt-1 italic">
              Portal Académico Admin
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
          {/* Título */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
              Título de la Evaluación *
            </label>
            <div className="relative">
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
                placeholder="Ej: Práctica Calificada 1"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
              Descripción
            </label>
            <textarea
              rows="4"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700 resize-none"
              placeholder="Instrucciones y detalles de la evaluación..."
            />
          </div>

          {/* Fecha Límite */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
              Fecha y Hora Límite *
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                type="datetime-local"
                value={form.fechaLimite}
                onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
              />
            </div>
          </div>

          {/* Intentos Permitidos */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
              Intentos Permitidos *
            </label>
            <div className="relative">
              <Hash
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                type="number"
                min="1"
                max="10"
                value={form.intentos}
                onChange={(e) => setForm({ ...form, intentos: parseInt(e.target.value) })}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
              />
            </div>
          </div>

          {/* Archivo (PDF/Guías) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
              Archivo de Instrucciones (PDF/Guías) - Opcional
            </label>
            <div className="relative">
              <Upload
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                size={18}
              />
              <input
                type="file"
                accept=".pdf,.doc,.docx,.zip,.rar"
                onChange={handleFileChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {form.archivo && (
              <p className="text-xs text-slate-500 ml-2">
                Archivo seleccionado: {form.archivo.name}
              </p>
            )}
          </div>
        </div>

        <div className="p-10 pt-0">
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {type === "crear" ? "Crear Evaluación" : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluacionModal;