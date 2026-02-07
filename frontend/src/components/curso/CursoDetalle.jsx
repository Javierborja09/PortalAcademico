import React from "react";
import { X, CalendarDays, BookOpen } from "lucide-react";
import { useCursoDetalle } from "@/hooks/useCursoDetalle";
import AnuncioAdmin from "@/components/anuncio/AnuncioAdmin";
import AnuncioCard from "@/components/anuncio/AnuncioCard";
import HorarioCard from "@/components/horario/HorarioCard";

const CursoDetalle = ({ isOpen, onClose, curso, horarios }) => {
  const {
    anuncios,
    loadingAnuncios,
    isFormOpen,
    anuncioAEditar,
    esDocente,
    hoy,
    handleEliminarAnuncio,
    abrirFormularioNuevo,
    abrirFormularioEditar,
    cerrarFormulario,
    recargarAnuncios,
  } = useCursoDetalle(isOpen, curso);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop con desenfoque */}
        <div
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-fadeIn"
          onClick={onClose}
        />

        <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
          {/* Header del Curso */}
          <div className="bg-slate-900 p-8 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="text-blue-400" size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                Detalles del Curso
              </span>
            </div>
            <h2 className="text-2xl font-black leading-tight">
              {curso.nombreCurso}
            </h2>
            <p className="text-blue-400 text-xs font-bold mt-1 uppercase tracking-widest">
              {curso.codigoCurso}
            </p>
          </div>

          {/* Contenido Scrollable */}
          <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* SECCIÓN: ANUNCIOS */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">
                  Anuncios
                </h3>
                {esDocente && (
                  <button
                    onClick={abrirFormularioNuevo}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200"
                  >
                    + Crear anuncio
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {loadingAnuncios ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-slate-100 animate-pulse rounded-2xl"
                      />
                    ))}
                  </div>
                ) : anuncios.length > 0 ? (
                  anuncios.map((anuncio) => (
                    <AnuncioCard
                      key={anuncio.id_anuncio}
                      anuncio={anuncio}
                      esDocente={esDocente}
                      hoy={hoy}
                      onEditar={abrirFormularioEditar}
                      onEliminar={handleEliminarAnuncio}
                    />
                  ))
                ) : (
                  <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <p className="text-[10px] text-slate-400 italic uppercase font-bold tracking-widest">
                      No hay anuncios publicados
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SECCIÓN: CRONOGRAMA */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-6">
                <CalendarDays className="text-slate-400" size={18} />
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">
                  Cronograma Semanal
                </h3>
              </div>

              <div className="space-y-3">
                {horarios && horarios.length > 0 ? (
                  horarios.map((h) => (
                    <HorarioCard key={h.id_horario} horario={h} />
                  ))
                ) : (
                  <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <p className="text-slate-400 text-[10px] font-bold italic uppercase tracking-widest">
                      Sin horarios asignados
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Botón de acción final */}
            <button
              onClick={onClose}
              className="w-full mt-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all"
            >
              Cerrar Vista
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Formulario (Admin) */}
      {isFormOpen && (
        <AnuncioAdmin
          idCurso={curso.id_curso}
          anuncioAEditar={anuncioAEditar}
          onClose={cerrarFormulario}
          onSuccess={() => {
            cerrarFormulario();
            recargarAnuncios();
          }}
        />
      )}
    </>
  );
};

export default CursoDetalle;
