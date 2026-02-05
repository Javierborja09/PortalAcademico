import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCursoById } from "@/services/courseService";
import { getIntegrantesCurso } from "@/services/matriculaService";
import sesionService from "@/services/sesionService";

/**
 * Hook maestro para el Aula Virtual.
 * Gestiona la sincronización en tiempo real de la sesión y la carga de datos del curso.
 */
export const useAulaVirtual = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [curso, setCurso] = useState(null);
    const [integrantes, setIntegrantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sesionActiva, setSesionActiva] = useState(false);
    const [errorAcceso, setErrorAcceso] = useState(false);

    // Estados de Modales
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

    const rol = localStorage.getItem('rol')?.toLowerCase();
    const usuarioNombre = localStorage.getItem('nombre') || 'Usuario';

    // Sincronización con WebSocket
    useEffect(() => {
        sesionService.conectar(id, (msg) => {
            if (msg.tipo === "START_SESSION" || msg.tipo === "SESSION_IS_ACTIVE") {
                setSesionActiva(true);
            } else if (msg.tipo === "END_SESSION" || msg.tipo === "SESSION_IS_INACTIVE") {
                setSesionActiva(false);
            }
        }, () => {
            sesionService.verificarEstado(id);
        });

        return () => sesionService.desconectar();
    }, [id]);

    // Carga de datos iniciales
    const cargarDatosAula = useCallback(async () => {
        try {
            setLoading(true);
            setErrorAcceso(false);
            const [dataCurso, dataIntegrantes] = await Promise.all([
                getCursoById(id),
                getIntegrantesCurso(id)
            ]);
            setCurso(dataCurso);
            setIntegrantes(dataIntegrantes);
        } catch (error) {
            if (error.response?.status === 403 || error.response?.status === 401) {
                setErrorAcceso(true);
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        cargarDatosAula();
    }, [cargarDatosAula]);

    const handleBack = () => navigate('/cursos');

    const handleActionSesion = () => {
        if (rol === 'docente' || rol === 'admin') {
            if (!sesionActiva) sesionService.iniciarClase(id, usuarioNombre);
            navigate(`/aula-virtual/${id}/sesion`);
        } else if (sesionActiva) {
            navigate(`/aula-virtual/${id}/sesion`);
        }
    };

    return {
        id,
        curso,
        integrantes,
        loading,
        sesionActiva,
        errorAcceso,
        rol,
        modals: {
            info: { isOpen: isInfoModalOpen, set: setIsInfoModalOpen },
            users: { isOpen: isUsersModalOpen, set: setIsUsersModalOpen }
        },
        handleBack,
        handleActionSesion
    };
};