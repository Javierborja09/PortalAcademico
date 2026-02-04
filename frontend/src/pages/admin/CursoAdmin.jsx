import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Upload,
  Loader2,
  BookOpen,
  UserCheck,
  Hash,
} from "lucide-react";
import api from "../../api/axiosConfig";

const CursoAdmin = ({ isOpen, onClose, curso = null, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [docentes, setDocentes] = useState([]);
  const [formData, setFormData] = useState({
    nombreCurso: "",
    codigoCurso: "",
    idDocente: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const cargarDocentes = async () => {
      try {
        const res = await api.get("/usuarios/listar");
        setDocentes(res.data.filter((u) => u.rol.toLowerCase() === "docente"));
      } catch (err) {
        console.error(err);
      }
    };

    if (isOpen) {
      cargarDocentes();
      if (curso) {
        setFormData({
          nombreCurso: curso.nombreCurso,
          codigoCurso: curso.codigoCurso || "",
          idDocente: curso.docente?.id_usuario || "",
          fechaInicio: curso.fechaInicio,
          fechaFin: curso.fechaFin,
        });
        setPreview(
          `http://localhost:8080${curso.imagenPortada}?t=${new Date().getTime()}`,
        );
      } else {
        setFormData({
          nombreCurso: "",
          codigoCurso: "",
          idDocente: "",
          fechaInicio: "",
          fechaFin: "",
        });
        setPreview(null);
        setImagen(null);
      }
    }
  }, [isOpen, curso]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("nombreCurso", formData.nombreCurso);
    data.append("codigoCurso", formData.codigoCurso);
    data.append("idDocente", formData.idDocente);
    data.append("fechaInicio", formData.fechaInicio);
    data.append("fechaFin", formData.fechaFin);

    if (imagen) {
      data.append("imagen", imagen);
    }

    try {
      let response;
      if (curso) {
        response = await api.put(`/cursos/editar/${curso.id_curso}`, data);
      } else {
        response = await api.post(
          `/cursos/crear?idDocente=${formData.idDocente}`,
          data,
        );
      }

      if (onSave && typeof onSave === "function") {
        onSave();
      }

      onClose();
    } catch (err) {
      console.error("Error completo:", err.response?.data || err.message);
      alert(
        "Error al procesar el curso: " +
          (err.response?.data?.mensaje || "Problema de conexión"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp"
      >
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">
              {curso ? "Editar Curso" : "Nuevo Curso"}
            </h2>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-1">
              Gestión Académica
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Portada */}
          <div className="md:col-span-2 flex flex-col items-center mb-4">
            <div className="w-full h-40 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden relative group">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                  alt="Preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "http://localhost:8080/courses/default.webp";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Upload size={32} />
                  <span className="text-[10px] font-bold uppercase mt-2">
                    Subir Portada
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImagen(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>

          {/* Nombre del Curso */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Nombre del Curso
            </label>
            <div className="relative">
              <BookOpen
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700"
                value={formData.nombreCurso}
                onChange={(e) =>
                  setFormData({ ...formData, nombreCurso: e.target.value })
                }
                placeholder="Ej. Algoritmos I"
              />
            </div>
          </div>

          {/* Código del Curso - NUEVO CAMPO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Código (ID Académico)
            </label>
            <div className="relative">
              <Hash
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700"
                value={formData.codigoCurso}
                onChange={(e) =>
                  setFormData({ ...formData, codigoCurso: e.target.value })
                }
                placeholder="Ej. INF-101"
              />
            </div>
          </div>

          {/* Docente Asignado */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Docente Asignado
            </label>
            <div className="relative">
              <UserCheck
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <select
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-700 appearance-none"
                value={formData.idDocente}
                onChange={(e) =>
                  setFormData({ ...formData, idDocente: e.target.value })
                }
              >
                <option value="">Seleccionar Docente</option>
                {docentes.map((d) => (
                  <option key={d.id_usuario} value={d.id_usuario}>
                    {d.nombre} {d.apellido}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha Inicio */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              required
              className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700"
              value={formData.fechaInicio}
              onChange={(e) =>
                setFormData({ ...formData, fechaInicio: e.target.value })
              }
            />
          </div>

          {/* Fecha Fin */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
              Fecha Fin
            </label>
            <input
              type="date"
              required
              className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700"
              value={formData.fechaFin}
              onChange={(e) =>
                setFormData({ ...formData, fechaFin: e.target.value })
              }
            />
          </div>
        </div>

        <div className="p-10 pt-0 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {curso ? "Actualizar Curso" : "Guardar Curso"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CursoAdmin;
