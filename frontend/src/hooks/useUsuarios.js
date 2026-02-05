import { useState, useEffect, useMemo, useCallback } from "react";
import { getAllUsuarios } from "@/services/userService";
/**
 * Hook para la gestión administrativa de usuarios.
 * Controla el ciclo de vida de los datos, búsqueda y estados de modales.
 */
export const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    const fetchUsuarios = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllUsuarios();
            setUsuarios(data || []);
        } catch (err) {
            console.error("Error cargando usuarios en hook:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    // Filtrado reactivo optimizado
    const filteredUsuarios = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return usuarios.filter(u =>
            `${u.nombre} ${u.apellido} ${u.correo} ${u.rol}`.toLowerCase().includes(term)
        );
    }, [searchTerm, usuarios]);

    const handleNuevoUsuario = () => {
        setSelectedUsuario(null);
        setIsModalOpen(true);
    };

    const handleEditar = (usuario) => {
        setSelectedUsuario(usuario);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return {
        usuarios: filteredUsuarios,
        loading,
        searchTerm,
        setSearchTerm,
        isModalOpen,
        selectedUsuario,
        handleNuevoUsuario,
        handleEditar,
        closeModal,
        refreshUsuarios: fetchUsuarios
    };
};