import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class SesionService {
    constructor() {
        this.client = null;
        // Almacén en memoria para evitar pesadez en el DOM
        // Estructura: { cursoId: [Mensaje1, Mensaje2, ...] }
        this.mensajesPorCurso = new Map();
    }

    // --- GESTIÓN DE MEMORIA ---

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

    obtenerHistorial(cursoId) {
        return this.mensajesPorCurso.get(parseInt(cursoId)) || [];
    }

    limpiarDatosCurso(cursoId) {
        this.mensajesPorCurso.delete(parseInt(cursoId));
        console.log(`[Memoria] Datos del curso ${cursoId} eliminados.`);
    }

    // --- CONEXIÓN Y EVENTOS ---

    conectar(cursoId, onMessageReceived, onConnectSuccess) {
        const socket = new SockJS("http://localhost:8080/ws-portal");
        this.client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                this.client.subscribe(`/topic/curso/${cursoId}`, (payload) => {
                    const msg = JSON.parse(payload.body);

                    // Si es un mensaje de chat, lo guardamos en el array de memoria
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

    desconectar() {
        if (this.client) {
            this.client.deactivate();
        }
    }

    enviarEvento(cursoId, datos) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.enviar/${cursoId}`,
                body: JSON.stringify(datos),
            });
        }
    }

    // --- MÉTODOS DE SESIÓN ---

    iniciarClase(cursoId, usuario) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.iniciar/${cursoId}`,
                body: JSON.stringify({ remitente: usuario, tipo: "START_SESSION" }),
            });
        }
    }

    finalizarClase(cursoId, usuario) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.finalizar/${cursoId}`,
                body: JSON.stringify({ remitente: usuario, tipo: "END_SESSION" }),
            });
            // Al finalizar, liberamos la memoria del navegador
            this.limpiarDatosCurso(cursoId);
        }
    }

    // --- PARTICIPANTES Y ESTADO ---

    solicitarListaParticipantes(cursoId) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.participantes/${cursoId}`,
            });
        }
    }

    verificarEstado(cursoId) {
        if (this.client?.connected) {
            this.client.publish({
                destination: `/app/sesion.verificar/${cursoId}`,
            });
        }
    }

    // Método asíncrono útil para guardias de navegación
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

            // Timeout de seguridad
            setTimeout(() => {
                sub.unsubscribe();
                resolve(false);
            }, 3000);
        });
    }
}

const instance = new SesionService();
export default instance;