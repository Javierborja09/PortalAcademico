import React from "react";
import { usePerfil } from "../hooks/usePerfil";
import {
  User,
  ShieldCheck,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Avatar from "@/components/common/Avatar";

const Perfil = () => {
  const {
    user,
    preview,
    loading,
    mensaje,
    selectedFile,
    handleFileChange,
    handleSubmit,
  } = usePerfil();

  return (
    <div className="animate-fadeIn flex justify-center items-start pt-10 px-4 pb-20">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* IZQUIERDA: TARJETA VISUAL */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-center relative overflow-hidden shadow-2xl">
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full opacity-30 blur-md"></div>

              {/* USAMOS EL COMPONENTE AVATAR AQUÍ */}
              <Avatar
                src={preview || user.foto}
                type="perfil"
                className="relative w-40 h-40 rounded-full object-cover border-4 border-slate-800 shadow-2xl bg-slate-800"
              />

              <label className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl cursor-pointer shadow-xl transition-all border-4 border-slate-900">
                <Camera size={20} strokeWidth={2.5} />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">
              {user.nombre}
            </h2>
            <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <ShieldCheck size={14} /> {user.rol}
            </div>
          </div>

          {mensaje.texto && (
            <div
              className={`p-5 rounded-[2rem] border flex items-center gap-3 animate-slideUp ${mensaje.tipo === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}
            >
              {mensaje.tipo === "success" ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
              <span className="text-sm font-black uppercase tracking-tight">
                {mensaje.texto}
              </span>
            </div>
          )}
        </div>

        {/* DERECHA: FORMULARIO */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Configuración
            </h1>
            <p className="text-slate-400 font-medium">
              Información registrada en el sistema
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <User size={14} /> Nombre Completo
              </label>
              <input
                type="text"
                value={user.nombre}
                disabled
                className="w-full p-5 bg-slate-50 border-transparent rounded-[1.5rem] text-slate-600 font-bold cursor-not-allowed"
              />
            </div>

            <div className="group space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <ShieldCheck size={14} /> Rango Académico
              </label>
              <input
                type="text"
                value={user.rol}
                disabled
                className="w-full p-5 bg-slate-50 border-transparent rounded-[1.5rem] text-slate-600 font-bold uppercase cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedFile}
              className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 ${loading || !selectedFile ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-slate-900 hover:bg-blue-600 text-white shadow-2xl active:scale-95"}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Procesando
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
