import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import sesionService from "@/services/sesionService";
import { getCursoById } from "@/services/courseService";
/**
 * Hook para gestionar la experiencia de la clase en vivo.
 * Ahora incluye la carga de metadatos del curso (Nombre, etc).
 */
export const useAulaSesion = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [curso, setCurso] = useState(null); // Estado para almacenar datos del curso
    const [isValidating, setIsValidating] = useState(true);
    const [showEndModal, setShowEndModal] = useState(false);
    const [notificacion, setNotificacion] = useState(null);
    const [activeTab, setActiveTab] = useState(null); 

    const rol = localStorage.getItem('rol')?.toLowerCase();
    const nombre = localStorage.getItem('nombre') || 'Usuario';
    const apellido = localStorage.getItem('apellido') || '';
    const usuarioNombre = `${nombre} ${apellido}`.trim();

    // 1. Carga de datos del curso para el Header
    const cargarDatosCurso = useCallback(async () => {
        try {
            const data = await getCursoById(id);
            setCurso(data);
        } catch (error) {
            console.error("Error al obtener detalles del curso para la sesión:", error);
        }
    }, [id]);

    useEffect(() => {
        cargarDatosCurso();
    }, [cargarDatosCurso]);

    // 2. Lógica de WebSockets y Sincronización
    useEffect(() => {
        sesionService.conectar(id, (msg) => {
            if (msg.tipo === "JOIN" || msg.tipo === "LEAVE") {
                setNotificacion(msg.contenido);
                setTimeout(() => setNotificacion(null), 2500);
            }

            if (msg.tipo === "END_SESSION") {
                setShowEndModal(true);
                sesionService.limpiarDatosCurso(id);
            }

            if (rol === 'alumno') {
                if (msg.tipo === "SESSION_IS_ACTIVE" || msg.tipo === "CHAT_HISTORY") {
                    setIsValidating(false);
                } else if (msg.tipo === "SESSION_IS_INACTIVE") {
                    navigate(`/aula-virtual/${id}`);
                }
            }
        }, () => {
            if (rol !== 'alumno') {
                setIsValidating(false);
            } else {
                sesionService.verificarEstado(id);
                setTimeout(() => {
                    setIsValidating(prev => {
                        if (prev) navigate(`/aula-virtual/${id}`);
                        return false;
                    });
                }, 4000);
            }

            sesionService.enviarEvento(id, {
                remitente: usuarioNombre,
                tipo: 'JOIN',
                rol: rol,
                contenido: `${usuarioNombre} se ha unido a la clase`
            });
        });

        return () => {
            sesionService.enviarEvento(id, {
                remitente: usuarioNombre,
                tipo: 'LEAVE',
                contenido: `${usuarioNombre} ha salido de la clase`
            });
            sesionService.desconectar();
        };
    }, [id, navigate, rol, usuarioNombre]);

    const toggleTab = (tab) => setActiveTab(activeTab === tab ? null : tab);

    const handleTerminarSesion = () => {
        if (rol === 'docente' || rol === 'admin') {
            sesionService.finalizarClase(id, usuarioNombre);
        } else {
            navigate(`/aula-virtual/${id}`);
        }
    };

    return {
        id,
        curso, // Retornamos el objeto curso completo
        isValidating,
        showEndModal,
        notificacion,
        activeTab,
        setActiveTab,
        usuarioNombre,
        rol,
        toggleTab,
        handleTerminarSesion
    };
};