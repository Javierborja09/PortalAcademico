import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class SesionService {
  constructor() {
    this.client = null;
  }

  verificarEstadoAsync(cursoId) {
    return new Promise((resolve) => {
      if (!this.client?.connected) {
        resolve(false);
        return;
      }

      const sub = this.client.subscribe(
        `/topic/curso/${cursoId}`,
        (payload) => {
          const msg = JSON.parse(payload.body);
          if (msg.tipo === "SESSION_IS_ACTIVE") {
            sub.unsubscribe();
            resolve(true);
          } else if (msg.tipo === "SESSION_IS_INACTIVE") {
            sub.unsubscribe();
            resolve(false);
          }
        },
      );

      this.client.publish({ destination: `/app/sesion.verificar/${cursoId}` });

      setTimeout(() => {
        sub.unsubscribe();
        resolve(false);
      }, 3000);
    });
  }

  conectar(cursoId, onMessageReceived, onConnectSuccess) {
    const socket = new SockJS("http://localhost:8080/ws-portal");
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        this.client.subscribe(`/topic/curso/${cursoId}`, (payload) => {
          onMessageReceived(JSON.parse(payload.body));
        });
        if (onConnectSuccess) onConnectSuccess();
      },
    });
    this.client.activate();
  }

  desconectar() {
    if (this.client) this.client.deactivate();
  }

  // Método genérico para enviar cualquier tipo de evento
  enviarEvento(cursoId, datos) {
    if (this.client?.connected) {
      this.client.publish({
        destination: `/app/sesion.enviar/${cursoId}`,
        body: JSON.stringify(datos),
      });
    }
  }

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
    }
  }

  verificarEstado(cursoId) {
    if (this.client?.connected) {
      this.client.publish({
        destination: `/app/sesion.verificar/${cursoId}`,
      });
    }
  }
}

const instance = new SesionService();
export default instance;
