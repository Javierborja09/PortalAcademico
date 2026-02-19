package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.dto.MensajeChatDTO;
import com.cibertec.portal_academico.servicios.SesionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

/**
 * Controlador de WebSockets para la gestión de Sesiones en tiempo real.
 * Utiliza el protocolo STOMP para permitir chat en vivo y control de estado de clase.
 */
@Controller // Se usa @Controller en lugar de @RestController para WebSockets
public class SesionController {

    @Autowired
    private SesionService sesionService;

    /**
     * Procesa y retransmite un mensaje de chat enviado por un usuario.
     * @param cursoId ID del curso (extraído de la ruta del destino).
     * @param mensaje Objeto DTO con el contenido y emisor del mensaje.
     * @return El mensaje procesado que será enviado a todos los suscritos al topic.
     */
    @MessageMapping("/sesion.enviar/{cursoId}") // Destino donde el cliente envía el mensaje
    @SendTo("/topic/curso/{cursoId}") // Canal donde se retransmite a todos los alumnos/docentes
    public MensajeChatDTO procesarMensaje(@DestinationVariable Integer cursoId, MensajeChatDTO mensaje) {
        // El servicio guarda el mensaje en la base de datos o caché antes de enviarlo
        return sesionService.procesarMensaje(cursoId, mensaje);
    }

    /**
     * Notifica el inicio de una sesión (clase en vivo).
     * Cambia el tipo de mensaje a 'START_SESSION' para que el frontend active la interfaz de clase.
     */
    @MessageMapping("/sesion.iniciar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChatDTO iniciarSesion(@DestinationVariable Integer cursoId, MensajeChatDTO mensaje) {
        sesionService.iniciarSesion(cursoId);
        mensaje.setTipo("START_SESSION");
        return mensaje;
    }

    /**
     * Notifica la finalización de la clase.
     * Informa a todos los suscritos que la sesión ha terminado.
     */
    @MessageMapping("/sesion.finalizar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChatDTO finalizarSesion(@DestinationVariable Integer cursoId, MensajeChatDTO mensaje) {
        sesionService.finalizarSesion(cursoId);
        mensaje.setTipo("END_SESSION");
        return mensaje;
    }

    /**
     * Verifica si una sesión está actualmente activa para un curso.
     * Útil cuando un alumno entra al aula virtual y necesita saber si la clase ya empezó.
     */
    @MessageMapping("/sesion.verificar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChatDTO verificarEstadoSesion(@DestinationVariable Integer cursoId) {
        MensajeChatDTO respuesta = new MensajeChatDTO();
        // Retorna un tipo específico según el estado en el servicio
        respuesta.setTipo(sesionService.estaActiva(cursoId) ? "SESSION_IS_ACTIVE" : "SESSION_IS_INACTIVE");
        return respuesta;
    }

    /**
     * Solicita el historial de mensajes de la sesión actual.
     * Retorna una estructura con los mensajes previos para cargar en el chat del alumno.
     */
    @MessageMapping("/sesion.historial/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public Map<String, Object> obtenerHistorial(@DestinationVariable Integer cursoId) {
        return sesionService.obtenerHistorial(cursoId);
    }

    /**
     * Obtiene la lista de usuarios conectados actualmente a la sesión del curso.
     */
    @MessageMapping("/sesion.participantes/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public Map<String, Object> obtenerParticipantes(@DestinationVariable Integer cursoId) {
        return sesionService.obtenerParticipantes(cursoId);
    }
}