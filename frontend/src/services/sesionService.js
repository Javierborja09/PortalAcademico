import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * Servicio encargado de gestionar la comunicación en tiempo real mediante WebSockets (STOMP).
 * Maneja la persistencia de mensajes en memoria, la lista de participantes y el estado de la sesión.
 */
class SesionService {
    constructor() {
        /** @type {Client|null} Instancia del cliente STOMP */
        this.client = null;
        /** @type {Map<number, Array>} Almacén de mensajes por ID de curso para evitar saturar el DOM */
        this.mensajesPorCurso = new Map();
    }

    // --- GESTIÓN DE MEMORIA ---

    /**
     * Guarda un mensaje en el historial temporal del navegador.
     * @param {number|string} cursoId - ID del curso actual.
     * @param {Object} mensaje - Objeto del mensaje recibido.
     */
    agregarMensajeAMemoria(cursoId, mensaje) {
        const id = parseInt(cursoId);
        if (!this.mensajesPorCurso.has(id)) {
            this.mensajesPorCurso.set(id, []);
        }
        const historial = this.mensajesPorCurso.get(id);
        historial.push(mensaje);

        // Limitamos a los últimos 150 mensajes para mantener el rendimiento óptimo
        if (historial.length > 150) historial.shift();
    }

    /**
     * Recupera los mensajes guardados para un curso específico.
     * @param {number|string} cursoId 
     * @returns {Array} Listado de mensajes.
     */
    obtenerHistorial(cursoId) {
        return this.mensajesPorCurso.get(parseInt(cursoId)) || [];
    }

    /**
     * Elimina los mensajes en memoria de un curso.
     * @param {number|string} cursoId 
     */
    limpiarDatosCurso(cursoId) {
        this.mensajesPorCurso.delete(parseInt(cursoId));
        console.log(`[Memoria] Datos del curso ${cursoId} eliminados.`);
    }

    // --- CONEXIÓN Y EVENTOS ---

    /**
     * Inicializa la conexión WebSocket y se suscribe al tópico del curso.
     * @param {number|string} cursoId - ID del curso para la suscripción.
     * @param {Function} onMessageReceived - Callback ejecutado al recibir cualquier mensaje.
     * @param {Function} onConnectSuccess - Callback ejecutado al establecer la conexión.
     */
    conectar(cursoId, onMessageReceived, onConnectSuccess) {
        const socket = new SockJS("http://localhost:8080/ws-portal");
        this.client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                this.client.subscribe(`/topic/curso/${cursoId}`, (payload) => {
                    const msg = JSON.parse(payload.body);

                    if (msg.tipo === 'CHAT') {
                        this.agregarMensajeAMemoria(cursoId, msg);
                    }

                    onMessageReceived(msg);
                });
                if (onConnectSuccess) onConnectSuccess();
            },
        });
        this.client.activate();
    }

    /** Cierra la conexión activa del cliente STOMP */
    desconectar() {
        if (this.client) {
            this.client.deactivate();
        }
    }

    /**
     * Publica un evento genérico al tópico del curso.
     * @param {number|string} cursoId 
     * @param {Object} datos - Cuerpo del mensaje (remitente, tipo, contenido, etc).
     */
    enviarEvento(cursoId, datos) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.enviar/${cursoId}`,
                body: JSON.stringify(datos),
            });
        }
    }

    // --- MÉTODOS DE SESIÓN ---

    /** Notifica el inicio de una clase (Exclusivo Docente) */
    iniciarClase(cursoId, usuario) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.iniciar/${cursoId}`,
                body: JSON.stringify({ remitente: usuario, tipo: "START_SESSION" }),
            });
        }
    }

    /** Finaliza la clase, notifica a los alumnos y limpia la memoria local */
    finalizarClase(cursoId, usuario) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.finalizar/${cursoId}`,
                body: JSON.stringify({ remitente: usuario, tipo: "END_SESSION" }),
            });
            this.limpiarDatosCurso(cursoId);
        }
    }

    // --- PARTICIPANTES Y ESTADO ---

    /** Solicita al servidor la lista actual de usuarios conectados */
    solicitarListaParticipantes(cursoId) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.participantes/${cursoId}`,
            });
        }
    }

    /** Envía una señal para verificar si la sesión sigue activa en el servidor */
    verificarEstado(cursoId) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.verificar/${cursoId}`,
            });
        }
    }

    /**
     * Versión asíncrona para verificar el estado de la sesión (ideal para Guards de React Router).
     * @param {number|string} cursoId 
     * @returns {Promise<boolean>} True si la sesión está activa.
     */
    verificarEstadoAsync(cursoId) {
        return new Promise((resolve) => {
            if (!this.client?.connected) {
                resolve(false);
                return;
            }

            const sub = this.client.subscribe(`/topic/curso/${cursoId}`, (payload) => {
                const msg = JSON.parse(payload.body);
                if (msg.tipo === "SESSION_IS_ACTIVE") {
                    sub.unsubscribe();
                    resolve(true);
                } else if (msg.tipo === "SESSION_IS_INACTIVE") {
                    sub.unsubscribe();
                    resolve(false);
                }
            });

            this.client.publish({ destination: `/app/sesion.verificar/${cursoId}` });

            setTimeout(() => {
                sub.unsubscribe();
                resolve(false);
            }, 3000);
        });
    }
}

const instance = new SesionService();
export default instance;