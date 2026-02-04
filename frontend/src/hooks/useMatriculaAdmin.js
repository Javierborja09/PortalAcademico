import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllUsuarios } from '../services/userService';
import { 
    matricularAlumno, 
    retirarAlumno, 
    getIntegrantesCurso 
} from '../services/matriculaService';

/**
 * Hook para gestionar la lógica de inscripciones.
 * Ahora utiliza servicios desacoplados para mayor mantenibilidad.
 */
export const useMatriculaAdmin = (curso, isOpen) => {
    const [alumnosMatriculados, setAlumnosMatriculados] = useState([]);
    const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const cargarAlumnosMatriculados = useCallback(async () => {
        if (!curso?.id_curso) return;
        try {
            setLoading(true);
            // Uso del servicio matriculaService
            const data = await getIntegrantesCurso(curso.id_curso);
            setAlumnosMatriculados(data);
        } catch (error) {
            console.error("Error al cargar matriculados", error);
        } finally {
            setLoading(false);
        }
    }, [curso?.id_curso]);

    const cargarTodosLosUsuarios = async () => {
        try {
            const data = await getAllUsuarios();
            setTodosLosUsuarios(data.filter(u => u.rol?.toLowerCase() === 'alumno'));
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        }
    };

    useEffect(() => {
        if (isOpen && curso) {
            cargarAlumnosMatriculados();
            cargarTodosLosUsuarios();
        }
    }, [isOpen, curso, cargarAlumnosMatriculados]);

    const handleMatricular = async (idAlumno) => {
        try {
            // Uso del servicio matriculaService
            await matricularAlumno(idAlumno, curso.id_curso, "2026-I");
            setSearchTerm("");
            cargarAlumnosMatriculados();
        } catch (error) {
            alert("El alumno ya podría estar matriculado o hubo un error.");
        }
    };

    const handleRetirar = async (idMatricula) => {
    if (window.confirm("¿Retirar al alumno de este curso?")) {
        try {
            await retirarAlumno(idMatricula);
            cargarAlumnosMatriculados();
        } catch (error) {
            console.error("Error al retirar alumno", error);
            alert("No se pudo retirar al alumno. Verifique el ID de matrícula.");
        }
    }
};

    const alumnosDisponibles = useMemo(() => {
        return todosLosUsuarios.filter(u => {
            const yaMatriculado = alumnosMatriculados.some(m => m.id_usuario === u.id_usuario);
            const coincideBusqueda = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                     u.apellido.toLowerCase().includes(searchTerm.toLowerCase());
            return !yaMatriculado && coincideBusqueda;
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