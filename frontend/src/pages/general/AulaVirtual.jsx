import React, { useState, useEffect } from "react";
import {
  User,
  Users,
  Info,
  ArrowLeft,
  Loader2,
  BookOpen,
  Video,
  Play,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { useAulaVirtual } from "@/hooks/useAulaVirtual";
import AulaBanner from "@/components/aula/AulaBanner";
import FilePreviewModal from "@/components/aula/contenido/FilePreviewModal";
import AulaIntegrantes from "@/components/aula/AulaIntegrantes";
import AulaDetalle from "@/components/aula/AulaDetalle";
import AulaContenido from "@/components/aula/contenido/AulaContenido";
import AulaContenidoAdmin from "@/components/aula/contenido/AulaContenidoAdmin";
import ContenidoService from "@/services/contenidoService";
import Avatar from "@/components/common/Avatar";
import { useContenidoAdmin } from "@/hooks/useContenidoAdmin";

// Importamos los nuevos componentes de modales
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
  } = useAulaVirtual();

  const [unidades, setUnidades] = useState([]);
  const [loadingContenido, setLoadingContenido] = useState(true);

  const [preview, setPreview] = useState({ isOpen: false, file: null });

  const openPreview = (file) => setPreview({ isOpen: true, file });

  // Instanciamos el hook de administración aquí para centralizar los modales
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

  if (errorAcceso)
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 w-full">
        <div className="bg-slate-950 w-full max-w-4xl rounded-[4rem] p-20 flex flex-col items-center justify-center shadow-2xl border border-white/5 animate-fadeIn">
          <div className="p-8 bg-red-500/10 rounded-[3rem] border border-red-500/20 mb-8">
            <ShieldAlert size={80} className="text-red-500" />
          </div>
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-4xl font-black uppercase text-white">
              Acceso Restringido
            </h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest max-w-md mx-auto leading-relaxed">
              No estás matriculado en este curso o no tienes permisos de
              docente.
            </p>
          </div>
          <button
            onClick={handleBack}
            className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            Volver a mis cursos
          </button>
        </div>
      </div>
    );

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
      <div
        className={`mb-10 rounded-[3rem] p-1 border shadow-2xl overflow-hidden relative transition-all duration-700 ${sesionActiva ? "bg-emerald-950 border-emerald-500/30" : "bg-slate-900 border-white/5"}`}
      >
        {sesionActiva && (
          <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
        )}
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="flex items-center gap-6">
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shadow-lg ${sesionActiva ? "bg-emerald-500" : "bg-white/10"}`}
            >
              <Video size={36} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                {sesionActiva ? "¡Clase en vivo!" : "Videoconferencia"}
              </h2>
              <p
                className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${sesionActiva ? "text-emerald-400" : "text-slate-400"}`}
              >
                {sesionActiva
                  ? "Hay una sesión activa"
                  : "Esperando inicio de clase"}
              </p>
            </div>
          </div>
          <button
            onClick={handleActionSesion}
            disabled={rol === "alumno" && !sesionActiva}
            className={`px-8 py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 ${rol === "docente" || sesionActiva ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-white/5 text-white/20 cursor-not-allowed"}`}
          >
            {rol === "docente"
              ? sesionActiva
                ? "Reingresar"
                : "Iniciar Clase"
              : sesionActiva
                ? "Unirse ahora"
                : "Cerrada"}{" "}
            <Play size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
          <Avatar
            src={curso?.docente?.foto_perfil}
            type="perfil"
            className="w-20 h-20 rounded-3xl shadow-lg"
          />
          <div className="text-left">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Docente Titular
            </p>
            <h3 className="text-xl font-black text-slate-800 uppercase leading-none">
              {curso?.docente
                ? `${curso.docente.nombre} ${curso.docente.apellido}`
                : "Sin asignar"}
            </h3>
            <button
              onClick={() => modals.info.set(true)}
              className="mt-3 flex items-center gap-2 text-blue-600 font-bold text-[10px] hover:underline uppercase tracking-tighter"
            >
              <Info size={12} /> Detalles Académicos
            </button>
          </div>
        </div>

        <button
          onClick={() => modals.users.set(true)}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 hover:shadow-xl transition-all"
        >
          <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Users size={32} />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Comunidad
            </p>
            <h3 className="text-lg font-black text-slate-800 uppercase leading-none">
              Participantes
            </h3>
            <p className="text-blue-600 text-[10px] font-bold mt-1 uppercase">
              {integrantes.length} Alumnos Inscritos
            </p>
          </div>
        </button>
      </div>

      {/* SECCIÓN DE CONTENIDO DINÁMICO */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-6 md:p-10 shadow-sm relative">
        {rol === "docente" ? (
          <AulaContenidoAdmin
            idCurso={curso?.id_curso}
            unidades={unidades}
            onRefresh={cargarContenido}
            // Inyectamos las funciones del hook para que los botones abran los modales de aquí
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
        )}
      </div>

      {/* ========================================== */}
      {/* MODALES DE ADMINISTRACIÓN (GLOBALES)      */}
      {/* ========================================== */}

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
