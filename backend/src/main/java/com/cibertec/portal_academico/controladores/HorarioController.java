package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Horario;
import com.cibertec.portal_academico.repositorios.CursoRepository;
import com.cibertec.portal_academico.repositorios.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    // 1. LISTAR HORARIOS POR CURSO (Accesible para todos los logueados)
    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> listarPorCurso(@PathVariable Integer idCurso) {
        List<Horario> horarios = horarioRepository.findByCursoId(idCurso);
        return ResponseEntity.ok(horarios);
    }

    // 2. AGREGAR HORARIO A UN CURSO (Solo Admin)
    @PostMapping("/agregar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> agregarHorario(@RequestBody Horario horario, @RequestParam Integer idCurso) {
        Optional<Curso> cursoOpt = cursoRepository.findById(idCurso);

        if (cursoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: El curso no existe.");
        }

        horario.setCurso(cursoOpt.get());
        return ResponseEntity.ok(horarioRepository.save(horario));
    }

    // 3. EDITAR HORARIO (Solo Admin)
    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> editarHorario(@PathVariable Integer id, @RequestBody Horario detalles) {
        return horarioRepository.findById(id).map(horario -> {
            horario.setDiaSemana(detalles.getDiaSemana());
            horario.setHoraInicio(detalles.getHoraInicio());
            horario.setHoraFin(detalles.getHoraFin());
            horario.setAula(detalles.getAula());
            return ResponseEntity.ok(horarioRepository.save(horario));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. LISTAR TODOS LOS HORARIOS (Solo Admin)
    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> listarTodos() {
        // Retorna todos los horarios registrados en la base de datos blackboard_db
        return ResponseEntity.ok(horarioRepository.findAll());
    }

    // 4. ELIMINAR HORARIO (Solo Admin)
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> eliminarHorario(@PathVariable Integer id) {
        if (!horarioRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Error: Horario no encontrado.");
        }
        horarioRepository.deleteById(id);
        return ResponseEntity.ok("Horario eliminado correctamente.");
    }
}
