package com.cibertec.portal_academico.servicios;

import com.cibertec.portal_academico.dto.MensajeChatDTO;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SesionService {

    private final Map<Integer, Boolean> sesionesActivas = new ConcurrentHashMap<>();
    private final Map<Integer, Map<String, String>> participantesPorCurso = new ConcurrentHashMap<>();
    private final Map<Integer, List<MensajeChatDTO>> historialMensajes = new ConcurrentHashMap<>();

    /**
     * Procesa un mensaje de chat y lo registra en el historial
     */
    public MensajeChatDTO procesarMensaje(Integer cursoId, MensajeChatDTO mensaje) {
        mensaje.setCursoId(cursoId);

        String tipo = mensaje.getTipo();
        String remitente = mensaje.getRemitente();
        String rol = mensaje.getRol() != null ? mensaje.getRol() : "alumno";

        switch (tipo) {
            case "CHAT":
                registrarMensaje(cursoId, mensaje);
                break;
            case "JOIN":
                agregarParticipante(cursoId, remitente, rol);
                break;
            case "LEAVE":
                removerParticipante(cursoId, remitente);
                break;
        }

        return mensaje;
    }

    /**
     * Inicia una sesión de chat para un curso
     */
    public void iniciarSesion(Integer cursoId) {
        sesionesActivas.put(cursoId, true);
    }

    /**
     * Finaliza una sesión y limpia los datos asociados
     */
    public void finalizarSesion(Integer cursoId) {
        sesionesActivas.remove(cursoId);
        participantesPorCurso.remove(cursoId);
        historialMensajes.remove(cursoId);
    }

    /**
     * Verifica si una sesión está activa
     */
    public boolean estaActiva(Integer cursoId) {
        return sesionesActivas.getOrDefault(cursoId, false);
    }

    /**
     * Obtiene el historial de mensajes de un curso
     */
    public Map<String, Object> obtenerHistorial(Integer cursoId) {
        Map<String, Object> respuesta = new HashMap<>();
        List<MensajeChatDTO> historial = historialMensajes.getOrDefault(cursoId, new ArrayList<>());
        boolean activa = estaActiva(cursoId);

        respuesta.put("tipo", "CHAT_HISTORY");
        respuesta.put("lista", historial);
        respuesta.put("sesionActiva", activa);
        
        return respuesta;
    }

    /**
     * Obtiene la lista de participantes activos en un curso
     */
    public Map<String, Object> obtenerParticipantes(Integer cursoId) {
        Map<String, Object> respuesta = new HashMap<>();
        Map<String, String> participantes = participantesPorCurso.getOrDefault(cursoId, new HashMap<>());

        List<Map<String, String>> listaFormateada = new ArrayList<>();
        participantes.forEach((nombre, rol) -> {
            Map<String, String> participante = new HashMap<>();
            participante.put("nombre", nombre);
            participante.put("rol", rol);
            listaFormateada.add(participante);
        });

        respuesta.put("tipo", "PARTICIPANTS_LIST");
        respuesta.put("lista", listaFormateada);
        
        return respuesta;
    }

    /**
     * Obtiene estadísticas de una sesión
     */
    public Map<String, Object> obtenerEstadisticas(Integer cursoId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMensajes", historialMensajes.getOrDefault(cursoId, new ArrayList<>()).size());
        stats.put("participantesActivos", participantesPorCurso.getOrDefault(cursoId, new HashMap<>()).size());
        stats.put("sesionActiva", estaActiva(cursoId));
        return stats;
    }

    // --- MÉTODOS PRIVADOS AUXILIARES ---

    private void registrarMensaje(Integer cursoId, MensajeChatDTO mensaje) {
        historialMensajes
                .computeIfAbsent(cursoId, k -> Collections.synchronizedList(new ArrayList<>()))
                .add(mensaje);
    }

    private void agregarParticipante(Integer cursoId, String nombre, String rol) {
        participantesPorCurso
                .computeIfAbsent(cursoId, k -> new ConcurrentHashMap<>())
                .put(nombre, rol);
    }

    private void removerParticipante(Integer cursoId, String nombre) {
        Map<String, String> participantes = participantesPorCurso.get(cursoId);
        if (participantes != null) {
            participantes.remove(nombre);
        }
    }

    /**
     * Limpia todos los datos (útil para testing o mantenimiento)
     */
    public void limpiarTodo() {
        sesionesActivas.clear();
        participantesPorCurso.clear();
        historialMensajes.clear();
    }

    /**
     * Obtiene información de todas las sesiones activas (útil para admin)
     */
    public Map<Integer, Map<String, Object>> obtenerTodasLasSesiones() {
        Map<Integer, Map<String, Object>> todasLasSesiones = new HashMap<>();
        
        sesionesActivas.keySet().forEach(cursoId -> {
            Map<String, Object> info = new HashMap<>();
            info.put("activa", estaActiva(cursoId));
            info.put("participantes", participantesPorCurso.getOrDefault(cursoId, new HashMap<>()).size());
            info.put("mensajes", historialMensajes.getOrDefault(cursoId, new ArrayList<>()).size());
            todasLasSesiones.put(cursoId, info);
        });
        
        return todasLasSesiones;
    }
}