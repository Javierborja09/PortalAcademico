package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Matricula;
import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.CursoRepository;
import com.cibertec.portal_academico.repositorios.MatriculaRepository;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/matriculas")
@CrossOrigin(origins = "*")
public class MatriculaController {

    @Autowired
    private MatriculaRepository matriculaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    // 1. LISTAR CURSOS DE UN ALUMNO ESPECÍFICO
    @GetMapping("/alumno/{idAlumno}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Curso>> listarCursosPorAlumno(@PathVariable Integer idAlumno) {
        List<Matricula> matriculas = matriculaRepository.findByAlumnoId(idAlumno);

        List<Curso> cursos = matriculas.stream()
                .map(Matricula::getCurso)
                .collect(Collectors.toList());

        return ResponseEntity.ok(cursos);
    }

    // 2. REGISTRAR NUEVA MATRÍCULA (INSCRIBIR)
    @PostMapping("/registrar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> matricularAlumno(@RequestBody Map<String, Object> payload) {
        try {
            Integer idAlumno = (Integer) payload.get("idAlumno");
            Integer idCurso = (Integer) payload.get("idCurso");
            String ciclo = (String) payload.get("ciclo");

            Usuario alumno = usuarioRepository.findById(idAlumno)
                    .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

            Curso curso = cursoRepository.findById(idCurso)
                    .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
            Matricula nuevaMatricula = new Matricula();
            nuevaMatricula.setAlumno(alumno);
            nuevaMatricula.setCurso(curso);
            nuevaMatricula.setCiclo(ciclo != null ? ciclo : "2026-I");

            matriculaRepository.save(nuevaMatricula);

            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Alumno matriculado exitosamente en " + curso.getNombreCurso());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error en la matrícula: " + e.getMessage());
        }
    }

    // 3. ELIMINAR MATRÍCULA (RETIRAR ALUMNO)
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> eliminarMatricula(@PathVariable Integer id) {
        try {
            if (!matriculaRepository.existsById(id)) {
                return ResponseEntity.status(404).body("Registro de matrícula no encontrado.");
            }

            matriculaRepository.deleteById(id);

            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "El alumno ha sido retirado del curso correctamente.");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al procesar el retiro: " + e.getMessage());
        }
    }

    // 4. LISTAR TODOS LOS ALUMNOS DE UN CURSO
    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Usuario>> listarAlumnosPorCurso(@PathVariable Integer idCurso) {
        List<Matricula> matriculas = matriculaRepository.findByCursoId(idCurso);

        List<Usuario> alumnos = matriculas.stream()
                .map(Matricula::getAlumno)
                .collect(Collectors.toList());

        return ResponseEntity.ok(alumnos);
    }
}