import { useState, useEffect, useCallback } from "react";
import { getAllHorarios, deleteHorario } from "@/services/horarioService";
/**
 * Hook para gestionar la lógica del cronograma de horarios.
 * Ahora desacoplado de la configuración de API directa.
 */
export const useHorarios = () => {
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHorario, setSelectedHorario] = useState(null);

    const fetchHorarios = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllHorarios();
            setHorarios(data);
        } catch (error) {
            console.error("Error al cargar la lista de horarios:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHorarios();
    }, [fetchHorarios]);

    const handleNuevoHorario = () => {
        setSelectedHorario(null);
        setIsModalOpen(true);
    };

    const handleEditar = (horario) => {
        setSelectedHorario(horario);
        setIsModalOpen(true);
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este horario?")) {
            try {
                await deleteHorario(id);
                setHorarios(prev => prev.filter(h => h.id_horario !== id));
            } catch (error) {
                alert("Error al eliminar el horario. Es posible que tenga dependencias activas.");
            }
        }
    };

    // Filtrado reactivo por curso o día
    const filteredHorarios = horarios.filter(h => 
        h.curso?.nombreCurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.diaSemana.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        horarios: filteredHorarios,
        loading,
        searchTerm,
        setSearchTerm,
        isModalOpen,
        setIsModalOpen,
        selectedHorario,
        handleNuevoHorario,
        handleEditar,
        handleEliminar,
        refreshHorarios: fetchHorarios
    };
};