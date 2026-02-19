import { useState, useEffect, useCallback } from 'react';
import ContenidoService from '@/services/contenidoService';

export const useAulaContenido = (idCurso) => {
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    // Estado para Unidades (Nivel 1)
    const [expandedUnidades, setExpandedUnidades] = useState({});
    // Estado para Temas (Nivel 2)
    const [expandedTemas, setExpandedTemas] = useState({});

    const cargarContenido = useCallback(async () => {
        if (!idCurso) return;
        try {
            setLoading(true);
            const data = await ContenidoService.getTodoElContenido(idCurso);
            setUnidades(data);
            if (data.length > 0 && Object.keys(expandedUnidades).length === 0) {
                setExpandedUnidades({ [data[0].idUnidad]: true });
            }
        } catch (error) {
            console.error("Error al cargar contenido:", error);
        } finally {
            setLoading(false);
        }
    }, [idCurso]);

    useEffect(() => {
        cargarContenido();
    }, [cargarContenido]);

    const toggleUnidad = (id) => {
        setExpandedUnidades(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleTema = (id) => {
        setExpandedTemas(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return {
        unidades,
        loading,
        expandedUnidades,
        expandedTemas,
        toggleUnidad,
        toggleTema,   
        refresh: cargarContenido
    };
};