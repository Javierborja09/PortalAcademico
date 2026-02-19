import { useState } from 'react';
import EvaluacionService from '@/services/evaluacionService';

export const useEvaluacionAdmin = (idCurso, onRefresh) => {
    const [modal, setModal] = useState({ isOpen: false, type: "", data: null });
    const [form, setForm] = useState({
        titulo: "", descripcion: "", fechaLimite: "", intentos: 1, archivo: null
    });
    const [loading, setLoading] = useState(false);

    const closeModal = () => {
        setModal({ isOpen: false, type: "", data: null });
        setForm({ titulo: "", descripcion: "", fechaLimite: "", intentos: 1, archivo: null });
    };

    const openCrear = () => setModal({ isOpen: true, type: "crear", data: null });

    const openEditar = (evaluacion) => {
        setForm({
            titulo: evaluacion.tituloEvaluacion,
            descripcion: evaluacion.descripcionEvaluacion || "",
            fechaLimite: evaluacion.fechaLimite ? evaluacion.fechaLimite.substring(0, 16) : "",
            intentos: evaluacion.intentosPermitidos,
            archivo: null
        });
        setModal({ isOpen: true, type: "editar", data: evaluacion });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (modal.type === "crear") {
                await EvaluacionService.crearEvaluacion(idCurso, form.titulo, form.descripcion, form.fechaLimite, form.intentos, form.archivo);
            } else {
                const idEval = modal.data.id_evaluacion || modal.data.idEvaluacion;
                await EvaluacionService.editarEvaluacion(idEval, form.titulo, form.descripcion, form.fechaLimite, form.intentos, form.archivo);
            }
            onRefresh();
            closeModal();
        } catch (error) {
            alert(error.response?.data || "Error en la operación");
        } finally {
            setLoading(false);
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Eliminar actividad?")) return;
        try {
            await EvaluacionService.eliminarEvaluacion(id);
            onRefresh();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    return { modal, form, setForm, loading, openCrear, openEditar, closeModal, handleSubmit, eliminar };
};