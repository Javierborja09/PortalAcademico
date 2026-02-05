package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Horario;
import com.cibertec.portal_academico.servicios.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para la gestión de horarios de los cursos.
 * Permite la organización de días, horas y aulas asignadas.
 */
@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*") // Permite peticiones desde el frontend
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    /**
     * Recupera el horario específico asignado a un curso.
     * @param idCurso ID del curso a consultar.
     * @return ResponseEntity con la lista de horarios (Días y horas).
     */
    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("isAuthenticated()") // Cualquier usuario logueado (alumno/docente/admin) puede ver horarios
    public ResponseEntity<?> listarPorCurso(@PathVariable Integer idCurso) {
        return ResponseEntity.ok(horarioService.listarPorCurso(idCurso));
    }

    /**
     * Registra una nueva sesión de horario para un curso.
     * @param horario Objeto JSON con datos del día, hora inicio, hora fin y aula.
     * @param idCurso ID del curso al que se vincula el horario.
     */
    @PostMapping("/agregar")
    @PreAuthorize("hasAuthority('admin')") // Solo el administrador puede modificar el calendario
    public ResponseEntity<?> agregarHorario(@RequestBody Horario horario, @RequestParam Integer idCurso) {
        try {
            Horario nuevoHorario = horarioService.agregarHorario(horario, idCurso);
            return ResponseEntity.ok(nuevoHorario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Actualiza los datos de una sesión de horario existente.
     * @param id ID del registro de horario a editar.
     * @param detalles Objeto con los nuevos datos (día, horas, aula).
     */
    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> editarHorario(@PathVariable Integer id, @RequestBody Horario detalles) {
        try {
            Horario horarioActualizado = horarioService.editarHorario(id, detalles);
            return ResponseEntity.ok(horarioActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Lista todos los horarios registrados en el sistema académico.
     * Útil para vistas generales de administración de aulas.
     */
    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> listarTodos() {
        return ResponseEntity.ok(horarioService.listarTodos());
    }

    /**
     * Elimina un registro de horario del sistema.
     * @param id ID del horario a suprimir.
     */
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> eliminarHorario(@PathVariable Integer id) {
        try {
            horarioService.eliminarHorario(id);
            return ResponseEntity.ok("Horario eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}