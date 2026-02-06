import { useState, useEffect, useCallback } from "react";
import { 
    getCursosByAlumno, 
    getCursosByDocente, 
    getAllCursos 
} from "@/services/courseService";
import { getHorariosByCurso } from "@/services/horarioService";

/**
 * Hook para gestionar la lógica de horarios basada en los cursos del usuario.
 */
export const useHorario = () => {
    const [cursos, setCursos] = useState([]);
    const [horarios, setHorarios] = useState({}); 
    const [loading, setLoading] = useState(true);
    
    const userId = localStorage.getItem('userId');
    const rol = localStorage.getItem('rol')?.toLowerCase();

    const cargarDatos = useCallback(async () => {
        if (!userId || !rol) return;

        try {
            setLoading(true);
            let cursosData = [];

            // 1. Obtener cursos según rol
            if (rol === 'admin') {
                cursosData = await getAllCursos();
            } else if (rol === 'docente') {
                cursosData = await getCursosByDocente(userId);
            } else {
                cursosData = await getCursosByAlumno(userId);
            }
            setCursos(cursosData || []);

            // 2. Obtener horarios para cada curso obtenido
            const horariosMap = {};
            await Promise.all(
                cursosData.map(async (curso) => {
                    try {
                        const data = await getHorariosByCurso(curso.id_curso);
                        horariosMap[curso.id_curso] = data || [];
                    } catch (err) {
                        console.error(`Error cargando horario para curso ${curso.id_curso}:`, err);
                        horariosMap[curso.id_curso] = [];
                    }
                })
            );
            setHorarios(horariosMap);

        } catch (error) {
            console.error("Error en useHorario:", error);
        } finally {
            setLoading(false);
        }
    }, [userId, rol]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    return {
        cursos,
        horarios,
        loading,
        rol,
        refreshHorarios: cargarDatos
    };
};