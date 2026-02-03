package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.dto.MensajeChat;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Controller
public class SesionController {

    // Mapa para gestionar la persistencia del estado de las clases en tiempo real
    private static final Map<Integer, Boolean> sesionesActivas = new ConcurrentHashMap<>();

    /**
     * Gestiona el envío de mensajes de chat y señales de WebRTC
     */
    @MessageMapping("/sesion.enviar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChat procesarMensaje(@DestinationVariable Integer cursoId, MensajeChat mensaje) {
        mensaje.setCursoId(cursoId);
        return mensaje;
    }

    

    /**
     * El docente activa la sesión para el curso específico
     */
    @MessageMapping("/sesion.iniciar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChat iniciarSesion(@DestinationVariable Integer cursoId, MensajeChat mensaje) {
        sesionesActivas.put(cursoId, true);
        mensaje.setTipo("START_SESSION");
        mensaje.setContenido("SESION_INICIADA");
        return mensaje;
    }

    /**
     * El docente cierra la sesión, notificando a todos los alumnos
     */
    @MessageMapping("/sesion.finalizar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChat finalizarSesion(@DestinationVariable Integer cursoId, MensajeChat mensaje) {
        sesionesActivas.remove(cursoId);
        mensaje.setTipo("END_SESSION");
        mensaje.setContenido("SESION_FINALIZADA");
        return mensaje;
    }

    /**
     * Permite a los usuarios que entran tarde conocer si la clase sigue activa
     */
@MessageMapping("/sesion.verificar/{cursoId}")
@SendTo("/topic/curso/{cursoId}") // Importante: el alumno debe estar suscrito a esto
public MensajeChat verificarEstadoSesion(@DestinationVariable Integer cursoId) {
    MensajeChat respuesta = new MensajeChat();
    boolean activa = sesionesActivas.getOrDefault(cursoId, false);
    respuesta.setTipo(activa ? "SESSION_IS_ACTIVE" : "SESSION_IS_INACTIVE");
    return respuesta;
}
}