import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import sesionService from "../services/sesionService";

/**
 * Hook para gestionar la experiencia de la clase en vivo.
 * Maneja la sincronización STOMP, notificaciones de participantes y fin de sesión.
 */
export const useAulaSesion = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isValidating, setIsValidating] = useState(true);
    const [showEndModal, setShowEndModal] = useState(false);
    const [notificacion, setNotificacion] = useState(null);
    const [activeTab, setActiveTab] = useState(null); // 'chat', 'users' o null

    const rol = localStorage.getItem('rol')?.toLowerCase();
    const nombre = localStorage.getItem('nombre') || 'Usuario';
    const apellido = localStorage.getItem('apellido') || '';
    const usuarioNombre = `${nombre} ${apellido}`.trim();

    useEffect(() => {
        // Conexión y Listeners de STOMP
        sesionService.conectar(id, (msg) => {
            // Manejo de Toasts (Entrada/Salida)
            if (msg.tipo === "JOIN" || msg.tipo === "LEAVE") {
                setNotificacion(msg.contenido);
                setTimeout(() => setNotificacion(null), 2500);
            }

            // Detección de fin de sesión global
            if (msg.tipo === "END_SESSION") {
                setShowEndModal(true);
                sesionService.limpiarDatosCurso(id);
            }

            // Lógica de validación para alumnos
            if (rol === 'alumno') {
                if (msg.tipo === "SESSION_IS_ACTIVE") {
                    setIsValidating(false);
                } else if (msg.tipo === "SESSION_IS_INACTIVE") {
                    navigate(`/aula-virtual/${id}`);
                }
            }
        }, () => {
            // Callback tras conexión exitosa
            if (rol !== 'alumno') {
                setIsValidating(false);
            } else {
                sesionService.verificarEstado(id);
                // Timeout de seguridad: si no responde el server en 4s, lo saca
                setTimeout(() => {
                    setIsValidating(prev => {
                        if (prev) navigate(`/aula-virtual/${id}`);
                        return false;
                    });
                }, 4000);
            }

            // Anuncio de entrada
            sesionService.enviarEvento(id, {
                remitente: usuarioNombre,
                tipo: 'JOIN',
                rol: rol,
                contenido: `${usuarioNombre} se ha unido a la clase`
            });
        });

        return () => {
            // Limpieza: Anunciar salida y apagar socket
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