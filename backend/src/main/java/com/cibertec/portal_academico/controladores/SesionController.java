package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.dto.MensajeChatDTO;
import com.cibertec.portal_academico.servicios.SesionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class SesionController {

    @Autowired
    private SesionService sesionService;

    @MessageMapping("/sesion.enviar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChatDTO procesarMensaje(@DestinationVariable Integer cursoId, MensajeChatDTO mensaje) {
        return sesionService.procesarMensaje(cursoId, mensaje);
    }

    @MessageMapping("/sesion.iniciar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChatDTO iniciarSesion(@DestinationVariable Integer cursoId, MensajeChatDTO mensaje) {
        sesionService.iniciarSesion(cursoId);
        mensaje.setTipo("START_SESSION");
        return mensaje;
    }

    @MessageMapping("/sesion.finalizar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChatDTO finalizarSesion(@DestinationVariable Integer cursoId, MensajeChatDTO mensaje) {
        sesionService.finalizarSesion(cursoId);
        mensaje.setTipo("END_SESSION");
        return mensaje;
    }

    @MessageMapping("/sesion.verificar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChatDTO verificarEstadoSesion(@DestinationVariable Integer cursoId) {
        MensajeChatDTO respuesta = new MensajeChatDTO();
        respuesta.setTipo(sesionService.estaActiva(cursoId) ? "SESSION_IS_ACTIVE" : "SESSION_IS_INACTIVE");
        return respuesta;
    }

    @MessageMapping("/sesion.historial/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public Map<String, Object> obtenerHistorial(@DestinationVariable Integer cursoId) {
        return sesionService.obtenerHistorial(cursoId);
    }

    @MessageMapping("/sesion.participantes/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public Map<String, Object> obtenerParticipantes(@DestinationVariable Integer cursoId) {
        return sesionService.obtenerParticipantes(cursoId);
    }
}