import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, BookOpen, ClipboardList } from "lucide-react";
import { useAulaVirtual } from "@/hooks/useAulaVirtual";
import AulaBanner from "@/components/aula/AulaBanner";
import AulaBannerSesion from "@/components/aula/AulaBannerSesion";
import FilePreviewModal from "@/components/aula/contenido/FilePreviewModal";
import AulaIntegrantes from "@/components/aula/AulaIntegrantes";
import AulaDetalle from "@/components/aula/AulaDetalle";
import AulaContenido from "@/components/aula/contenido/AulaContenido";
import AulaContenidoAdmin from "@/components/aula/contenido/AulaContenidoAdmin";
import AulaEvaluaciones from "@/components/aula/evaluacion/AulaEvaluaciones";
import ContenidoService from "@/services/contenidoService";
import { useContenidoAdmin } from "@/hooks/useContenidoAdmin";
import AulaAccesoRestringido from "@/components/aula/AulaAccesoRestringido";
import AulaStats from "@/components/aula/AulaStats";
import ContenidoModal from "@/components/aula/contenido/ContenidoModal";
import FileUploadModal from "@/components/aula/contenido/FileUploadModal";

const AulaVirtual = () => {
  const {
    curso,
    integrantes,
    loading: loadingHook,
    sesionActiva,
    errorAcceso,
    rol,
    modals,
    handleBack,
    handleActionSesion,
    usuario,
  } = useAulaVirtual();

  const [unidades, setUnidades] = useState([]);
  const [loadingContenido, setLoadingContenido] = useState(true);
  const [vistaActual, setVistaActual] = useState("contenido");

  const [preview, setPreview] = useState({ isOpen: false, file: null });

  const openPreview = (file) => setPreview({ isOpen: true, file });

  const {
    modal,
    form,
    setForm,
    loading: loadingAdmin,
    fileModal,
    fileData,
    setFileData,
    openUnidadModal,
    openTemaModal,
    openUploadModal,
    closeModal,
    closeUploadModal,
    handleSubmit,
    handleFileSubmit,
    handleDelete,
  } = useContenidoAdmin(curso?.id_curso, () => cargarContenido());

  useEffect(() => {
    if (curso?.id_curso) {
      cargarContenido();
    }
  }, [curso]);

  const cargarContenido = async () => {
    try {
      setLoadingContenido(true);
      const data = await ContenidoService.getTodoElContenido(curso.id_curso);
      setUnidades(data);
    } catch (error) {
      console.error("Error al cargar el sílabo:", error);
    } finally {
      setLoadingContenido(false);
    }
  };

  if (errorAcceso) return <AulaAccesoRestringido onBack={handleBack} />;

  if (loadingHook)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 text-blue-600 bg-white">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="font-black uppercase tracking-widest text-[10px]">
          Iniciando entorno virtual...
        </p>
      </div>
    );

  return (
    <div className="animate-fadeIn pb-20 w-full max-w-7xl mx-auto px-4 md:px-8 relative">
      {/* Navegación */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm group transition-all"
        >
          <div className="p-2 rounded-xl bg-white shadow-sm group-hover:bg-blue-50">
            <ArrowLeft size={16} />
          </div>
          Volver a mis cursos
        </button>
      </div>

      <AulaBanner curso={curso} />

      {/* BANNER SESIÓN VIVO */}
      <AulaBannerSesion
        sesionActiva={sesionActiva}
        rol={rol}
        handleActionSesion={handleActionSesion}
      />
      <AulaStats
        curso={curso}
        integrantesCount={integrantes.length}
        onOpenInfo={() => modals.info.set(true)}
        onOpenUsers={() => modals.users.set(true)}
      />

      {/* TABS DE NAVEGACIÓN */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setVistaActual("contenido")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-xs transition-all ${vistaActual === "contenido"
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
        >
          <BookOpen size={16} />
          Contenido
        </button>
        <button
          onClick={() => setVistaActual("evaluaciones")}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-xs transition-all ${vistaActual === "evaluaciones"
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
        >
          <ClipboardList size={16} />
          Evaluaciones
        </button>
      </div>

      {/* CONTENIDO DINÁMICO SEGÚN LA VISTA */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-6 md:p-10 shadow-sm relative">
        {vistaActual === "contenido" ? (
          rol === "docente" ? (
            <AulaContenidoAdmin
              idCurso={curso?.id_curso}
              unidades={unidades}
              onRefresh={cargarContenido}
              openUnidadModal={openUnidadModal}
              openTemaModal={openTemaModal}
              openUploadModal={openUploadModal}
              handleDelete={handleDelete}
            />
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 mb-8">
                <BookOpen className="text-blue-600" /> Repositorio de Materiales
              </h2>
              <AulaContenido
                idCurso={curso?.id_curso}
                unidades={unidades}
                rol={rol}
                onDelete={handleDelete}
                onUploadFile={openUploadModal}
                onEditUnidad={openUnidadModal}
                onEditTema={openTemaModal}
                onPreview={openPreview}
                loading={loadingContenido}
              />
            </>
          )
        ) : (
          <AulaEvaluaciones
            idCurso={curso?.id_curso}
            idAlumno={usuario?.id_usuario}
            rol={rol}
          />
        )}
      </div>

      {/* MODALES DE ADMINISTRACIÓN (GLOBALES) */}
      <ContenidoModal
        {...modal}
        form={form}
        setForm={setForm}
        loading={loadingAdmin}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
      <FilePreviewModal
        isOpen={preview.isOpen}
        file={preview.file}
        onClose={() => setPreview({ isOpen: false, file: null })}
      />

      <FileUploadModal
        {...fileModal}
        fileData={fileData}
        setFileData={setFileData}
        loading={loadingAdmin}
        onClose={closeUploadModal}
        onSubmit={handleFileSubmit}
      />

      <AulaIntegrantes
        isOpen={modals.users.isOpen}
        onClose={() => modals.users.set(false)}
        integrantes={integrantes}
      />
      <AulaDetalle
        isOpen={modals.info.isOpen}
        onClose={() => modals.info.set(false)}
        curso={curso}
      />
    </div>
  );
};

export default AulaVirtual;