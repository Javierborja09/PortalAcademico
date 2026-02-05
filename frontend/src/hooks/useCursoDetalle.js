import { useState, useEffect, useCallback } from 'react';
import { getAnunciosByCurso, eliminarAnuncio } from './../services/anuncioService';

export const useCursoDetalle = (isOpen, curso) => {
    const [anuncios, setAnuncios] = useState([]);
    const [loadingAnuncios, setLoadingAnuncios] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [anuncioAEditar, setAnuncioAEditar] = useState(null);

    const rol = localStorage.getItem('rol')?.toLowerCase();
    const esDocente = rol === 'docente';
    const hoy = new Date().toLocaleDateString('en-CA');

    const cargarAnuncios = useCallback(async () => {
        if (!curso?.id_curso) return;
        try {
            setLoadingAnuncios(true);
            const data = await getAnunciosByCurso(curso.id_curso);
            setAnuncios(data);
        } catch (error) {
            console.error("Error al cargar anuncios", error);
        } finally {
            setLoadingAnuncios(false);
        }
    }, [curso?.id_curso]);

    const handleEliminarAnuncio = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este anuncio?")) {
            try {
                await eliminarAnuncio(id);
                await cargarAnuncios();
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    const abrirFormularioNuevo = () => {
        setAnuncioAEditar(null);
        setIsFormOpen(true);
    };

    const abrirFormularioEditar = (anuncio) => {
        setAnuncioAEditar(anuncio);
        setIsFormOpen(true);
    };

    const cerrarFormulario = () => {
        setIsFormOpen(false);
        setAnuncioAEditar(null);
    };

    useEffect(() => {
        if (isOpen) {
            cargarAnuncios();
        }
    }, [isOpen, cargarAnuncios]);

    return {
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
        recargarAnuncios: cargarAnuncios
    };
};