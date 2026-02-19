import { useState } from 'react';
import EntregaService from '@/services/entregaService';

export const useEntregaAdmin = (idAlumno, onRefresh) => {
    const [modal, setModal] = useState({ isOpen: false, type: "", data: null });
    const [entregaForm, setEntregaForm] = useState({ texto: "", archivo: null });
    const [calificarForm, setCalificarForm] = useState({ nota: "", comentario: "" });
    const [loading, setLoading] = useState(false);

    const closeModal = () => {
        setModal({ isOpen: false, type: "", data: null });
        setEntregaForm({ texto: "", archivo: null });
        setCalificarForm({ nota: "", comentario: "" });
    };

    const openEnviar = (evaluacion) => setModal({ isOpen: true, type: "enviar", data: evaluacion });
    const openVerEntregas = (evaluacion) => setModal({ isOpen: true, type: "ver-entregas", data: evaluacion });
    const openCalificar = (entrega) => {
        setCalificarForm({ nota: entrega.nota ?? "", comentario: entrega.comentarioDocente ?? "" });
        setModal({ isOpen: true, type: "calificar", data: entrega });
    };

    const handleEnviarTarea = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const idEval = modal.data.id_evaluacion || modal.data.idEvaluacion;
            await EntregaService.enviarTarea(idEval, Number(idAlumno), entregaForm.texto, entregaForm.archivo);
            onRefresh();
            closeModal();
        } catch (error) {
            alert("Error al enviar");
        } finally {
            setLoading(false);
        }
    };

    const handleCalificar = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await EntregaService.calificarEntrega(modal.data.idEntrega, parseFloat(calificarForm.nota), calificarForm.comentario);
            onRefresh();
            closeModal();
        } catch (error) {
            alert("Error al calificar");
        } finally {
            setLoading(false);
        }
    };

    return { 
        modal, entregaForm, setEntregaForm, calificarForm, setCalificarForm, 
        loading, openEnviar, openVerEntregas, openCalificar, closeModal, 
        handleEnviarTarea, handleCalificar 
    };
};