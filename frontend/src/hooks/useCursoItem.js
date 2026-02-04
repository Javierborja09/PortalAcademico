import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Importamos el servicio en lugar de la instancia de API directamente
import { getHorariosByCurso } from "../services/horarioService";

/**
 * Hook para gestionar la lógica individual de cada ítem de curso.
 * Consume servicios desacoplados para mejorar la mantenibilidad.
 */
export const useCursoItem = (cursoId) => {
    const navigate = useNavigate();
    
    // Estados de modales
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isMatriculaOpen, setIsMatriculaOpen] = useState(false);
    
    // Datos adicionales
    const [horarios, setHorarios] = useState([]);
    const [isLoadingHorarios, setIsLoadingHorarios] = useState(false);

    /**
     * Carga los horarios mediante el servicio y abre el modal de detalles.
     */
    const handleOpenDetails = async () => {
        try {
            setIsLoadingHorarios(true);
            const data = await getHorariosByCurso(cursoId);
            setHorarios(data);
            setIsDetailsOpen(true);
        } catch (error) {
            console.error("Error al cargar horarios del curso", error);
        } finally {
            setIsLoadingHorarios(false);
        }
    };

    const handleIrAAulaVirtual = () => {
        navigate(`/aula-virtual/${cursoId}`);
    };

    return {
        modals: {
            details: { isOpen: isDetailsOpen, set: setIsDetailsOpen },
            admin: { isOpen: isAdminModalOpen, set: setIsAdminModalOpen },
            matricula: { isOpen: isMatriculaOpen, set: setIsMatriculaOpen }
        },
        horarios,
        isLoadingHorarios,
        handleOpenDetails,
        handleIrAAulaVirtual
    };
};