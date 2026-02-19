import React from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Layout,
  FileText,
  UploadCloud,
  X,
} from "lucide-react";

const AulaContenidoAdmin = ({
  unidades,
  openUnidadModal,
  openTemaModal,
  openUploadModal,
  handleDelete,
}) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header de la sección de administración */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Estructura Curricular
          </p>
        </div>
        <button
          onClick={() => openUnidadModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black uppercase text-[9px] hover:bg-blue-600 transition-all shadow-lg active:scale-95"
        >
          <Plus size={14} /> Nueva Unidad
        </button>
      </div>

      {/* Listado Jerárquico */}
      <div className="space-y-3">
        {unidades.map((u) => (
          <div
            key={u.idUnidad}
            className="bg-slate-50/50 border border-slate-100 rounded-[1.5rem] p-4 md:p-5"
          >
            {/* Fila de Unidad */}
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Layout size={18} />
                </div>
                <h3 className="font-black text-slate-800 uppercase text-[11px] md:text-xs truncate">
                  {u.tituloUnidad}
                </h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openUnidadModal(u)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => handleDelete("unidad", u.idUnidad)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Listado de Temas dentro de la Unidad */}
            <div className="pl-4 md:pl-8 space-y-2">
              {u.temas?.map((t) => (
                <div
                  key={t.id_tema}
                  className="bg-white p-3 md:p-4 rounded-xl border border-slate-100 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText size={14} className="text-slate-300 shrink-0" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase truncate">
                        {t.tituloTema}
                      </span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => openUploadModal(t.id_tema)}
                        title="Subir Archivo"
                        className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                      >
                        <UploadCloud size={14} />
                      </button>
                      <button
                        onClick={() => openTemaModal(u.idUnidad, t)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-all"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete("tema", t.id_tema)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Lista de Documentos del Tema (Vista rápida de gestión) */}
                  {t.documentos?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-50">
                      {t.documentos.map((doc) => (
                        <div
                          key={doc.id_documento}
                          className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-md border border-slate-100 group transition-all"
                        >
                          <span className="text-[8px] font-black text-slate-500 truncate max-w-[100px] uppercase">
                            {doc.tituloDocumento}
                          </span>
                          <button
                            onClick={() =>
                              handleDelete("documento", doc.id_documento)
                            }
                            className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Botón rápido para agregar tema */}
              <button
                onClick={() => openTemaModal(u.idUnidad)}
                className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-[9px] font-black text-slate-400 uppercase hover:border-blue-300 hover:text-blue-600 hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <Plus size={12} /> Agregar Tema a esta Unidad
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AulaContenidoAdmin;
