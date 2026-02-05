import { useState, useEffect } from "react";
import { getAllUsuarios } from "../services/userService";
import { crearCurso, editarCurso } from "@/services/courseService";

export const useCursoAdmin = (curso, isOpen, onClose, onSave) => {
  const [loading, setLoading] = useState(false);
  const [docentes, setDocentes] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    nombreCurso: "",
    codigoCurso: "",
    idDocente: "",
    fechaInicio: "",
    fechaFin: "",
  });

  useEffect(() => {
    const cargarDocentes = async () => {
      try {
        const data = await getAllUsuarios();
        setDocentes(data.filter((u) => u.rol.toLowerCase() === "docente"));
      } catch (err) {
        console.error("Error al cargar docentes:", err);
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
        setPreview(`http://localhost:8080${curso.imagenPortada}?t=${new Date().getTime()}`);
      } else {
        setFormData({ nombreCurso: "", codigoCurso: "", idDocente: "", fechaInicio: "", fechaFin: "" });
        setPreview(null);
        setImagen(null);
      }
    }
  }, [isOpen, curso]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("nombreCurso", formData.nombreCurso);
    data.append("codigoCurso", formData.codigoCurso);
    data.append("idDocente", formData.idDocente);
    data.append("fechaInicio", formData.fechaInicio);
    data.append("fechaFin", formData.fechaFin);
    if (imagen) data.append("imagen", imagen);

    try {
      if (curso) {
        await editarCurso(curso.id_curso, data);
      } else {
        await crearCurso(data, formData.idDocente);
      }

      if (onSave) onSave();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.mensaje || "Problema de conexión";
      alert("Error al procesar el curso: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { formData, docentes, loading, preview, handleChange, handleFileChange, handleSubmit };
};