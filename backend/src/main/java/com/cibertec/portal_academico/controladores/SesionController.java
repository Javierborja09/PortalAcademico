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

    private static final Map<Integer, Boolean> sesionesActivas = new ConcurrentHashMap<>();
    private static final Map<Integer, Map<String, String>> participantesPorCurso = new ConcurrentHashMap<>();

    // Historial en la RAM del servidor
    private static final Map<Integer, List<MensajeChat>> historialMensajes = new ConcurrentHashMap<>();

    @MessageMapping("/sesion.enviar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChat procesarMensaje(@DestinationVariable Integer cursoId, MensajeChat mensaje) {
        mensaje.setCursoId(cursoId);

        String tipo = mensaje.getTipo();
        String remitente = mensaje.getRemitente();
        String rol = mensaje.getRol() != null ? mensaje.getRol() : "alumno";

        if ("CHAT".equals(tipo)) {
            historialMensajes.computeIfAbsent(cursoId, k -> Collections.synchronizedList(new ArrayList<>()))
                    .add(mensaje);
        } else if ("JOIN".equals(tipo)) {
            participantesPorCurso.computeIfAbsent(cursoId, k -> new ConcurrentHashMap<>())
                    .put(remitente, rol);
        } else if ("LEAVE".equals(tipo)) {
            if (participantesPorCurso.containsKey(cursoId)) {
                participantesPorCurso.get(cursoId).remove(remitente);
            }
        }
        return mensaje;
    }

    @MessageMapping("/sesion.historial/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public Map<String, Object> obtenerHistorial(@DestinationVariable Integer cursoId) {
        Map<String, Object> respuesta = new HashMap<>();
        List<MensajeChat> historial = historialMensajes.getOrDefault(cursoId, new ArrayList<>());
        boolean activa = sesionesActivas.getOrDefault(cursoId, false);

        respuesta.put("tipo", "CHAT_HISTORY");
        respuesta.put("lista", historial);
        respuesta.put("sesionActiva", activa);
        return respuesta;
    }

    @MessageMapping("/sesion.participantes/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public Map<String, Object> obtenerParticipantes(@DestinationVariable Integer cursoId) {
        Map<String, Object> respuesta = new HashMap<>();
        Map<String, String> lista = participantesPorCurso.getOrDefault(cursoId, new HashMap<>());

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

    @MessageMapping("/sesion.finalizar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChat finalizarSesion(@DestinationVariable Integer cursoId, MensajeChat mensaje) {
        sesionesActivas.remove(cursoId);
        participantesPorCurso.remove(cursoId);
        historialMensajes.remove(cursoId); 
        mensaje.setTipo("END_SESSION");
        return mensaje;
    }

    @MessageMapping("/sesion.verificar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChat verificarEstadoSesion(@DestinationVariable Integer cursoId) {
        MensajeChat respuesta = new MensajeChat();
        respuesta.setTipo(sesionesActivas.getOrDefault(cursoId, false) ? "SESSION_IS_ACTIVE" : "SESSION_IS_INACTIVE");
        return respuesta;
    }

    @MessageMapping("/sesion.iniciar/{cursoId}")
    @SendTo("/topic/curso/{cursoId}")
    public MensajeChat iniciarSesion(@DestinationVariable Integer cursoId, MensajeChat mensaje) {
        sesionesActivas.put(cursoId, true);
        mensaje.setTipo("START_SESSION");
        return mensaje;
    }
}