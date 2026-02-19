import React from "react";
import { X, UserPlus, Trash2, Search, Loader2, UserCheck } from "lucide-react";
import { useMatriculaAdmin } from "@/hooks/useMatriculaAdmin";
import Avatar from "@/components/common/Avatar";

const MatriculaAdmin = ({ isOpen, onClose, curso }) => {
  const {
    alumnosMatriculados,
    alumnosDisponibles,
    loading,
    searchTerm,
    setSearchTerm,
    handleMatricular,
    handleRetirar,
  } = useMatriculaAdmin(curso, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp border border-white/10">
        {/* Header del Modal */}
        <header className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <UserCheck size={20} />
            </div>
            <div>
              <h2 className="font-black text-lg uppercase tracking-tight">
                Gestión de Matrículas
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {curso?.nombreCurso || "Curso"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        <div className="p-8">
          {/* Buscador de Alumnos */}
          <div className="relative mb-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o correo electrónico..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Dropdown de Resultados de Búsqueda */}
            {searchTerm.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl z-20 max-h-52 overflow-y-auto p-2 border-t-4 border-t-indigo-600">
                {alumnosDisponibles.length > 0 ? (
                  alumnosDisponibles.map((u) => (
                    <div
                      key={u.id_usuario}
                      className="flex items-center justify-between p-3 hover:bg-indigo-50/50 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <Avatar
                          src={u.foto_perfil}
                          className="w-9 h-9 rounded-full shadow-sm"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">
                            {u.nombre} {u.apellido}
                          </span>
                          <span className="text-[10px] text-indigo-500 font-semibold">
                            {u.correo}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMatricular(u.id_usuario)}
                        className="p-2 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all active:scale-90 shadow-sm"
                      >
                        <UserPlus size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 text-[10px] font-black uppercase">
                    No se encontraron alumnos disponibles
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Listado de Integrantes */}
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 ml-2">
            Integrantes del curso
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 className="animate-spin text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Cargando lista...
                </span>
              </div>
            ) : alumnosMatriculados.length > 0 ? (
              alumnosMatriculados.map((m) => (
                <div
                  key={m.id_usuario}
                  className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 text-left">
                    <Avatar
                      src={m.foto_perfil}
                      type="perfil"
                      className="w-10 h-10 rounded-full group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <p className="text-sm font-black text-slate-800 leading-tight">
                        {m.nombre} {m.apellido}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {m.correo}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRetirar(m.id_matricula)}
                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Retirar alumno"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200">
                <UserCheck size={40} className="mx-auto mb-2 text-slate-200" />
                <p className="font-bold text-[10px] uppercase tracking-widest text-slate-300">
                  No hay alumnos matriculados
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatriculaAdmin;
