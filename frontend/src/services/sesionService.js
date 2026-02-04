import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * Servicio encargado de gestionar la comunicación en tiempo real mediante WebSockets (STOMP).
 * Ahora el historial reside en el servidor para permitir persistencia tras recargas.
 */
class SesionService {
    constructor() {
        /** @type {Client|null} Instancia del cliente STOMP */
        this.client = null;
        // Ya no necesitamos mensajesPorCurso en el constructor porque el servidor es la fuente de verdad
    }

    /**
     * El historial se pide al servidor y se maneja en el estado del componente (useChatAula).
     */
    obtenerHistorial(cursoId) {
        // Retornamos vacío inicialmente; el historial llegará vía WebSocket
        return [];
    }

    // --- CONEXIÓN Y EVENTOS ---

    /**
     * Inicializa la conexión WebSocket y se suscribe al tópico del curso.
     */
    conectar(cursoId, onMessageReceived, onConnectSuccess) {
        const socket = new SockJS("http://localhost:8080/ws-portal");
        this.client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                this.client.subscribe(`/topic/curso/${cursoId}`, (payload) => {
                    const msg = JSON.parse(payload.body);
                    // Pasamos cualquier mensaje (CHAT, CHAT_HISTORY, etc.) al callback
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

    /** Solicita al servidor el historial de mensajes guardados en su RAM */
    solicitarHistorial(cursoId) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.historial/${cursoId}`,
            });
        }
    }

    /** Notifica el inicio de una clase (Exclusivo Docente) */
    iniciarClase(cursoId, usuario) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.iniciar/${cursoId}`,
                body: JSON.stringify({ remitente: usuario, tipo: "START_SESSION" }),
            });
        }
    }

    /** Finaliza la clase y limpia el historial en el servidor */
    finalizarClase(cursoId, usuario) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.finalizar/${cursoId}`,
                body: JSON.stringify({ remitente: usuario, tipo: "END_SESSION" }),
            });
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

    /** Envía una señal para verificar si la sesión sigue activa */
    verificarEstado(cursoId) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.verificar/${cursoId}`,
            });
        }
    }

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