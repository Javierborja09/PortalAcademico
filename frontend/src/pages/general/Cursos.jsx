import React from "react";
import { useCursos } from "@/hooks/useCursos";
import CursoAdmin from "@/components/curso/CursoAdmin";
import { BookOpen, Plus, BookX, GraduationCap, Search } from "lucide-react"; 
import CursoItem from "@/components/curso/CursoItem";

const Cursos = () => {
  const {
    cursos,
    loading,
    rol,
    searchTerm,
    setSearchTerm,
    isAdminModalOpen,
    openAdminModal,
    closeAdminModal,
    refreshCursos,
  } = useCursos();

  return (
    <div className="animate-fadeIn px-4">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600 hidden sm:block">
            <GraduationCap size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {rol === "admin"
                ? "Administración"
                : rol === "docente"
                  ? "Cursos Dictados"
                  : "Mis Asignaturas"}
            </h1>
            <p className="text-slate-500 mt-1 font-medium flex items-center gap-2">
              <BookOpen size={16} />
              {rol === "docente"
                ? "Gestiona tus clases asignadas."
                : "Explora tus contenidos académicos."}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* INPUT DE BÚSQUEDA */}
          <div className="relative w-full sm:w-80 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-slate-700 font-medium placeholder:text-slate-400"
            />
          </div>

          {rol === "admin" && (
            <button
              onClick={openAdminModal}
              className="w-full sm:w-auto bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 group"
            >
              <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform"
              />
              Crear Curso
            </button>
          )}
        </div>
      </header>

      {/* Resto del componente (Loading y Grid) igual... */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 bg-white rounded-[2.5rem] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cursos.length > 0 ? (
            cursos.map((curso) => (
              <CursoItem
                key={curso.id_curso}
                curso={curso}
                rol={rol}
                onRefresh={refreshCursos}
              />
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
              <BookX size={48} className="text-slate-300 mb-4" />
              <h3 className="text-slate-900 font-black text-xl">
                {searchTerm
                  ? `No hay resultados para "${searchTerm}"`
                  : "Sin asignaturas"}
              </h3>
            </div>
          )}
        </div>
      )}

      {rol === "admin" && (
        <CursoAdmin
          isOpen={isAdminModalOpen}
          onClose={closeAdminModal}
          onSave={refreshCursos}
        />
      )}
    </div>
  );
};

export default Cursos;
