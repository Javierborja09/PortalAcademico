package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Horario;
import com.cibertec.portal_academico.servicios.HorarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> listarPorCurso(@PathVariable Integer idCurso) {
        return ResponseEntity.ok(horarioService.listarPorCurso(idCurso));
    }

    @PostMapping("/agregar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> agregarHorario(@RequestBody Horario horario, @RequestParam Integer idCurso) {
        try {
            Horario nuevoHorario = horarioService.agregarHorario(horario, idCurso);
            return ResponseEntity.ok(nuevoHorario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

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

    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> listarTodos() {
        return ResponseEntity.ok(horarioService.listarTodos());
    }

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