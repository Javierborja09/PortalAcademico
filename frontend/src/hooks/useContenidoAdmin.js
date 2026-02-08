import { useState } from 'react';
import ContenidoService from '@/services/contenidoService';

export const useContenidoAdmin = (idCurso, onRefresh) => {
    // 1. Estado para Modales de Estructura (Unidad/Tema)
    const [modal, setModal] = useState({
        isOpen: false,
        type: "", // 'unidad' | 'tema'
        mode: "create", // 'create' | 'edit'
        data: null,
    });

    // 2. Estado para el Modal de Archivos
    const [fileModal, setFileModal] = useState({
        isOpen: false,
        idTema: null
    });

    // 3. Estados de Formularios
    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        idPadre: null,
    });

    const [fileData, setFileData] = useState({
        titulo: "",
        archivo: null
    });

    const [loading, setLoading] = useState(false);

    // --- LÓGICA DE MODALES (UNIDAD/TEMA) ---

    const closeModal = () => {
        setModal({ isOpen: false, type: "", mode: "create", data: null });
        setForm({ titulo: "", descripcion: "", idPadre: null });
    };

    const openUnidadModal = (unidad = null) => {
        setForm({
            titulo: unidad?.tituloUnidad || "",
            descripcion: "",
            idPadre: null,
        });
        setModal({
            isOpen: true,
            type: "unidad",
            mode: unidad ? "edit" : "create",
            data: unidad,
        });
    };

    const openTemaModal = (idUnidad, tema = null) => {
        setForm({
            titulo: tema?.tituloTema || "",
            descripcion: tema?.descripcionTema || "",
            idPadre: idUnidad,
        });
        setModal({
            isOpen: true,
            type: "tema",
            mode: tema ? "edit" : "create",
            data: tema,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (modal.type === "unidad") {
                if (modal.mode === "create") {
                    await ContenidoService.crearUnidad(idCurso, form.titulo);
                } else {
                    await ContenidoService.editarUnidad(modal.data.idUnidad, form.titulo);
                }
            } else {
                if (modal.mode === "create") {
                    await ContenidoService.crearTema(form.idPadre, form.titulo, form.descripcion);
                } else {
                    await ContenidoService.editarTema(modal.data.id_tema, form.titulo, form.descripcion);
                }
            }
            if (onRefresh) onRefresh();
            closeModal();
        } catch (error) {
            console.error("Error al procesar contenido:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- LÓGICA DE ARCHIVOS (DOCUMENTOS) ---

    const openUploadModal = (idTema) => {
        setFileModal({ isOpen: true, idTema });
        setFileData({ titulo: "", archivo: null });
    };

    const closeUploadModal = () => {
        setFileModal({ isOpen: false, idTema: null });
        setFileData({ titulo: "", archivo: null });
    };

    const handleFileSubmit = async (e) => {
        e.preventDefault();
        if (!fileData.archivo) return alert("Selecciona un archivo primero");
        
        setLoading(true);
        try {
            await ContenidoService.subirDocumento(
                fileModal.idTema, 
                fileData.titulo, 
                fileData.archivo
            );
            if (onRefresh) onRefresh();
            closeUploadModal();
        } catch (error) {
            console.error("Error al subir archivo:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- ELIMINACIÓN GENERAL ---

    const handleDelete = async (type, id) => {
        if (!window.confirm(`¿Estás seguro de eliminar esta ${type}?`)) return;
        try {
            if (type === "unidad") await ContenidoService.eliminarUnidad(id);
            else if (type === "tema") await ContenidoService.eliminarTema(id);
            else if (type === "documento") await ContenidoService.eliminarDocumento(id);
            
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return {
        // Estados y lógica estructural
        modal, form, setForm, loading,
        openUnidadModal, openTemaModal, closeModal, handleSubmit,
        
        // Estados y lógica de archivos
        fileModal, fileData, setFileData,
        openUploadModal, closeUploadModal, handleFileSubmit,
        
        // Eliminar común
        handleDelete
    };
};