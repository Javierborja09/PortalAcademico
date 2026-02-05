package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Matricula;
import com.cibertec.portal_academico.servicios.MatriculaService;
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
    private MatriculaService matriculaService;

    // 1. LISTAR CURSOS DE UN ALUMNO ESPECÍFICO
    @GetMapping("/alumno/{idAlumno}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Curso>> listarCursosPorAlumno(@PathVariable Integer idAlumno) {
        List<Curso> cursos = matriculaService.listarCursosPorAlumno(idAlumno);
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

            Matricula matricula = matriculaService.matricularAlumno(idAlumno, idCurso, ciclo);

            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Alumno matriculado exitosamente en " + matricula.getCurso().getNombreCurso());

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
            matriculaService.eliminarMatricula(id);

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
    public ResponseEntity<?> listarAlumnosPorCurso(@PathVariable Integer idCurso) {
        List<Matricula> matriculas = matriculaService.listarMatriculasPorCurso(idCurso);

        // Creamos una lista de mapas (objetos JSON personalizados)
        List<Map<String, Object>> respuesta = matriculas.stream().map(m -> {
            Map<String, Object> datos = new HashMap<>();
            datos.put("id_matricula", m.getId_matricula());
            datos.put("id_usuario", m.getAlumno().getId_usuario());
            datos.put("nombre", m.getAlumno().getNombre());
            datos.put("apellido", m.getAlumno().getApellido());
            datos.put("correo", m.getAlumno().getCorreo());
            datos.put("foto_perfil", m.getAlumno().getFoto_perfil());
            return datos;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(respuesta);
    }
}