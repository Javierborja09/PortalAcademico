package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.dto.MensajeChat;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class SesionController {

    // Estado de las clases: {cursoId -> IsActive}
    private static final Map<Integer, Boolean> sesionesActivas = new ConcurrentHashMap<>();

    // Participantes en tiempo real: {cursoId -> {NombreUsuario -> Rol}}
    private static final Map<Integer, Map<String, String>> participantesPorCurso = new ConcurrentHashMap<>();

    /**
     * Procesa mensajes de chat y gestiona eventos de presencia (JOIN/LEAVE)
     */
    @MessageMapping("/sesion.enviar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChat procesarMensaje(@DestinationVariable Integer cursoId, MensajeChat mensaje) {
        mensaje.setCursoId(cursoId);

        String tipo = mensaje.getTipo();
        String remitente = mensaje.getRemitente();
        String rol = mensaje.getRol() != null ? mensaje.getRol() : "alumno";

        if ("JOIN".equals(tipo)) {
            // Agregamos al usuario al mapa de participantes del curso
            participantesPorCurso.computeIfAbsent(cursoId, k -> new ConcurrentHashMap<>())
                                 .put(remitente, rol);
        } else if ("LEAVE".equals(tipo)) {
            // Eliminamos al usuario cuando sale
            if (participantesPorCurso.containsKey(cursoId)) {
                participantesPorCurso.get(cursoId).remove(remitente);
            }
        }

        return mensaje;
    }

    /**
     * Devuelve la lista completa de participantes conectados a un curso específico
     */
    @MessageMapping("/sesion.participantes/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public Map<String, Object> obtenerParticipantes(@DestinationVariable Integer cursoId) {
        Map<String, Object> respuesta = new HashMap<>();
        Map<String, String> lista = participantesPorCurso.getOrDefault(cursoId, new HashMap<>());

        // Convertimos el mapa interno a una lista de objetos para el frontend
        List<Map<String, String>> listaFormateada = new ArrayList<>();
        lista.forEach((nombre, rol) -> {
            Map<String, String> p = new HashMap<>();
            p.put("nombre", nombre);
            p.put("rol", rol);
            listaFormateada.add(p);
        });

        respuesta.put("tipo", "PARTICIPANTS_LIST");
        respuesta.put("lista", listaFormateada);
        return respuesta;
    }

    /**
     * Inicia la sesión de clase (Docente)
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
     * Finaliza la sesión de clase y limpia la memoria del servidor
     */
    @MessageMapping("/sesion.finalizar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChat finalizarSesion(@DestinationVariable Integer cursoId, MensajeChat mensaje) {
        sesionesActivas.remove(cursoId);
        // Limpiamos la lista de participantes al cerrar la clase
        participantesPorCurso.remove(cursoId);
        
        mensaje.setTipo("END_SESSION");
        mensaje.setContenido("SESION_FINALIZADA");
        return mensaje;
    }

    /**
     * Verifica si una sesión está activa para usuarios que entran tarde
     */
    @MessageMapping("/sesion.verificar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChat verificarEstadoSesion(@DestinationVariable Integer cursoId) {
        MensajeChat respuesta = new MensajeChat();
        boolean activa = sesionesActivas.getOrDefault(cursoId, false);
        respuesta.setTipo(activa ? "SESSION_IS_ACTIVE" : "SESSION_IS_INACTIVE");
        return respuesta;
    }
}