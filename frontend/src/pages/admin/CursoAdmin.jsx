import React from "react";
import { X, Save, Upload, Loader2, BookOpen, UserCheck, Hash } from "lucide-react";
import { useCursoAdmin } from "../../hooks/useCursoAdmin";

const CursoAdmin = ({ isOpen, onClose, curso = null, onSave }) => {
  const {
    formData,
    docentes,
    loading,
    preview,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = useCursoAdmin(curso, isOpen, onClose, onSave);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn" onClick={onClose} />

      <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
        
        {/* Cabecera */}
        <header className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">{curso ? "Editar Curso" : "Nuevo Curso"}</h2>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-1">Gestión Académica</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
        </header>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Portada del Curso */}
          <div className="md:col-span-2 flex flex-col items-center mb-4">
            <div className="w-full h-40 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden relative group">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" 
                     onError={(e) => { e.target.src = "http://localhost:8080/courses/default.webp"; }} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Upload size={32} />
                  <span className="text-[10px] font-bold uppercase mt-2">Subir Portada</span>
                </div>
              )}
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
            </div>
          </div>

          {/* Información del Curso */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nombre del Curso</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input name="nombreCurso" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700"
                value={formData.nombreCurso} onChange={handleChange} placeholder="Ej. Algoritmos I" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Código (ID Académico)</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input name="codigoCurso" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700"
                value={formData.codigoCurso} onChange={handleChange} placeholder="Ej. INF-101" />
            </div>
          </div>

          {/* Docente */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Docente Responsable</label>
            <div className="relative">
              <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select name="idDocente" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700 appearance-none"
                value={formData.idDocente} onChange={handleChange}>
                <option value="">Seleccionar Docente</option>
                {docentes.map((d) => <option key={d.id_usuario} value={d.id_usuario}>{d.nombre} {d.apellido}</option>)}
              </select>
            </div>
          </div>

          {/* Fechas */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Fecha Inicio</label>
            <input name="fechaInicio" type="date" required className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700"
              value={formData.fechaInicio} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Fecha Fin</label>
            <input name="fechaFin" type="date" required className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700"
              value={formData.fechaFin} onChange={handleChange} />
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="p-10 pt-0">
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:bg-slate-100">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            {curso ? "Actualizar Curso" : "Crear Curso"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CursoAdmin;