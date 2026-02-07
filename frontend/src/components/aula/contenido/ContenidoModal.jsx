import React from "react";
import { X, Save, Type, AlignLeft, Loader2 } from "lucide-react";

const ContenidoModal = ({
  isOpen,
  mode,
  type,
  form,
  setForm,
  loading,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Capa de fondo con Blur Total */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      <form
        onSubmit={onSubmit}
        className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-slideUp"
      >
        <header className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              {mode === "create" ? "Crear" : "Editar"} {type}
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
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
              Título
            </label>
            <div className="relative">
              <Type
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
                placeholder={`Nombre de la ${type}...`}
              />
            </div>
          </div>

          {type === "tema" && (
            <div className="space-y-2 animate-slideDown">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                Descripción
              </label>
              <textarea
                rows="3"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700 resize-none"
                placeholder="Breve descripción..."
              />
            </div>
          )}
        </div>

        <div className="p-10 pt-0">
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:bg-slate-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContenidoModal;
