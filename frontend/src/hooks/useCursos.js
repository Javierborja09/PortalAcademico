import { useState, useEffect, useCallback, useMemo } from "react";
import { 
    getCursosByAlumno, 
    getAllCursos, 
    getCursosByDocente 
} from "@/services/courseService";

/**
 * Hook para gestionar la lógica de la lista de cursos con filtrado integrado.
 */
export const useCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    
    const userId = localStorage.getItem('userId');
    const rol = localStorage.getItem('rol')?.toLowerCase();

    const cargarDatos = useCallback(async () => {
        if (!userId || !rol) return;

        try {
            setLoading(true);
            let data = [];

            if (rol === 'admin') {
                data = await getAllCursos();
            } else if (rol === 'docente') {
                data = await getCursosByDocente(userId);
            } else {
                data = await getCursosByAlumno(userId);
            }

            setCursos(data || []);
        } catch (error) {
            console.error("Error al cargar cursos en el hook:", error);
        } finally {
            setLoading(false);
        }
    }, [userId, rol]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    /**
     * Lógica de filtrado reactiva:
     * Filtra por nombreCurso o codigoCurso ignorando mayúsculas/minúsculas.
     */
    const cursosFiltrados = useMemo(() => {
        if (!searchTerm.trim()) return cursos;

        const target = searchTerm.toLowerCase().trim();
        return cursos.filter(curso => 
            curso.nombreCurso?.toLowerCase().includes(target) || 
            curso.codigoCurso?.toLowerCase().includes(target)
        );
    }, [cursos, searchTerm]);

    const openAdminModal = () => setIsAdminModalOpen(true);
    const closeAdminModal = () => setIsAdminModalOpen(false);

    return {
        cursos: cursosFiltrados, 
        totalOriginal: cursos.length,
        loading,
        rol,
        searchTerm,
        setSearchTerm,
        isAdminModalOpen,
        openAdminModal,
        closeAdminModal,
        refreshCursos: cargarDatos
    };
};