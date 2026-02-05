import { useState, useEffect, useCallback } from "react";
import { 
    getCursosByAlumno, 
    getAllCursos, 
    getCursosByDocente 
} from "@/services/courseService";
/**
 * Hook para gestionar la lógica de la lista de cursos.
 * Maneja la carga inicial, el refresco de datos y el estado del modal de admin.
 */
export const useCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    
    // Obtenemos datos de sesión
    const userId = localStorage.getItem('userId');
    const rol = localStorage.getItem('rol')?.toLowerCase();

    const cargarDatos = useCallback(async () => {
        if (!userId || !rol) return;

        try {
            setLoading(true);
            let data = [];

            // Estrategia de carga según rol
            if (rol === 'admin') {
                data = await getAllCursos();
            } else if (rol === 'docente') {
                data = await getCursosByDocente(userId);
            } else {
                data = await getCursosByAlumno(userId);
            }

            setCursos(data);
        } catch (error) {
            console.error("Error al cargar cursos en el hook:", error);
        } finally {
            setLoading(false);
        }
    }, [userId, rol]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const openAdminModal = () => setIsAdminModalOpen(true);
    const closeAdminModal = () => setIsAdminModalOpen(false);

    return {
        cursos,
        loading,
        rol,
        isAdminModalOpen,
        openAdminModal,
        closeAdminModal,
        refreshCursos: cargarDatos
    };
};