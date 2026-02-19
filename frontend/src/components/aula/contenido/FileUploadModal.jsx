import React from "react";
import { X, UploadCloud, Loader2 } from "lucide-react";

const FileUploadModal = ({
  isOpen,
  fileData,
  setFileData,
  loading,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      <form
        onSubmit={onSubmit}
        className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp"
      >
        <header className="bg-blue-600 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              Subir Material
            </h2>
            <p className="text-blue-100 text-[9px] font-bold uppercase tracking-widest mt-1">
              PDF, Imágenes o Documentos
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
              Nombre del Archivo
            </label>
            <input
              required
              value={fileData.titulo}
              onChange={(e) =>
                setFileData({ ...fileData, titulo: e.target.value })
              }
              className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
              placeholder="Ej: Guía Práctica 01"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
              Seleccionar Archivo físico
            </label>
            <input
              type="file"
              required
              onChange={(e) =>
                setFileData({ ...fileData, archivo: e.target.files[0] })
              }
              className="w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="p-10 pt-0">
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:bg-slate-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <UploadCloud size={18} />
            )}
            Confirmar Subida
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUploadModal;
