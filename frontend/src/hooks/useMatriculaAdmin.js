import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllUsuarios } from '@/services/userService';
import { 
    matricularAlumno, 
    retirarAlumno, 
    getIntegrantesCurso 
} from '@/services/matriculaService';

/**
 * Hook para gestionar la lógica de inscripciones.
 * Permite filtrar alumnos disponibles por nombre, apellido o correo.
 */
export const useMatriculaAdmin = (curso, isOpen) => {
    const [alumnosMatriculados, setAlumnosMatriculados] = useState([]);
    const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // 1. Cargar alumnos que ya están en este curso
    const cargarAlumnosMatriculados = useCallback(async () => {
        if (!curso?.id_curso) return;
        try {
            setLoading(true);
            const data = await getIntegrantesCurso(curso.id_curso);
            setAlumnosMatriculados(data);
        } catch (error) {
            console.error("Error al cargar matriculados:", error);
        } finally {
            setLoading(false);
        }
    }, [curso?.id_curso]);

    // 2. Cargar lista global de usuarios (filtrando solo por rol 'alumno')
    const cargarTodosLosUsuarios = async () => {
        try {
            const data = await getAllUsuarios();
            setTodosLosUsuarios(data.filter(u => u.rol?.toLowerCase() === 'alumno'));
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    // Efecto para disparar las cargas cuando se abre el modal
    useEffect(() => {
        if (isOpen && curso) {
            cargarAlumnosMatriculados();
            cargarTodosLosUsuarios();
        }
    }, [isOpen, curso, cargarAlumnosMatriculados]);

    // Acción: Matricular
    const handleMatricular = async (idAlumno) => {
        try {
            // Se usa el ciclo 2026-I por defecto
            await matricularAlumno(idAlumno, curso.id_curso, "2026-I");
            setSearchTerm(""); // Limpiar búsqueda tras matricular
            cargarAlumnosMatriculados(); // Refrescar lista de integrantes
        } catch (error) {
            alert("Error: El alumno ya podría estar matriculado o hubo un fallo en el servidor.");
        }
    };

    // Acción: Retirar
    const handleRetirar = async (idMatricula) => {
        if (window.confirm("¿Estás seguro de retirar al alumno de este curso?")) {
            try {
                await retirarAlumno(idMatricula);
                cargarAlumnosMatriculados(); // Refrescar lista
            } catch (error) {
                console.error("Error al retirar alumno:", error);
                alert("No se pudo procesar el retiro.");
            }
        }
    };

    /**
     * Lógica de Filtrado:
     * Excluye a los ya matriculados y filtra por Nombre, Apellido o Correo.
     */
    const alumnosDisponibles = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        
        return todosLosUsuarios.filter(u => {
            // No mostrar si ya está en el curso
            const yaMatriculado = alumnosMatriculados.some(m => m.id_usuario === u.id_usuario);
            if (yaMatriculado) return false;

            // Si no hay búsqueda, no mostramos nada en el dropdown (opcional)
            if (!term) return false;

            // Coincidencia en múltiples campos
            return (
                u.nombre?.toLowerCase().includes(term) || 
                u.apellido?.toLowerCase().includes(term) || 
                u.correo?.toLowerCase().includes(term)
            );
        });
    }, [todosLosUsuarios, alumnosMatriculados, searchTerm]);

    return {
        alumnosMatriculados,
        alumnosDisponibles,
        loading,
        searchTerm,
        setSearchTerm,
        handleMatricular,
        handleRetirar
    };
};