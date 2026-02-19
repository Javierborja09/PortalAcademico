import React from "react";
import {
  X,
  Save,
  Clock,
  MapPin,
  CalendarDays,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useHorarioAdmin } from "@/hooks/useHorarioAdmin";

const HorarioAdmin = ({ isOpen, onClose, horario = null, onSave }) => {
  const { formData, cursos, loading, handleSubmit, handleChange } =
    useHorarioAdmin(horario, isOpen, onSave, onClose);

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp"
      >
        <header className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">
              {horario ? "Editar Programación" : "Nueva Programación"}
            </h2>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-1 italic">
              Módulo de Gestión Olyxis
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </header>

        <div className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Curso Asignado
            </label>
            <div className="relative">
              <BookOpen
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <select
                name="idCurso"
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700 appearance-none"
                value={formData.idCurso}
                onChange={handleChange}
                disabled={!!horario} // Opcional: no permitir cambiar de curso al editar
              >
                <option value="">Seleccionar un curso</option>
                {cursos.map((c) => (
                  <option key={c.id_curso} value={c.id_curso}>
                    {c.nombreCurso} ({c.codigoCurso})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Día
              </label>
              <div className="relative">
                <CalendarDays
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <select
                  name="diaSemana"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700 appearance-none"
                  value={formData.diaSemana}
                  onChange={handleChange}
                >
                  <option value="">Día...</option>
                  {dias.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Aula / Ubicación
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  name="aula"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
                  value={formData.aula}
                  onChange={handleChange}
                  placeholder="Ej: Lab A1"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Hora Inicio
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  name="horaInicio"
                  type="time"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
                  value={formData.horaInicio}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Hora Fin
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  name="horaFin"
                  type="time"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white font-bold text-slate-700"
                  value={formData.horaFin}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 pt-0">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:bg-slate-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {horario ? "Actualizar Programación" : "Crear Programación"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HorarioAdmin;
