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

/**
 * Controlador REST para la gestión de matrículas.
 * Administra la inscripción de alumnos en cursos y la consulta de listas de clase.
 */
@RestController
@RequestMapping("/api/matriculas")
@CrossOrigin(origins = "*")
public class MatriculaController {

    @Autowired
    private MatriculaService matriculaService;

    /**
     * Obtiene la lista de cursos en los que está inscrito un alumno particular.
     * @param idAlumno ID del usuario con rol alumno.
     * @return Lista de objetos Curso.
     */
    @GetMapping("/alumno/{idAlumno}")
    @PreAuthorize("isAuthenticated()") // Estudiantes y docentes pueden consultar esta info
    public ResponseEntity<List<Curso>> listarCursosPorAlumno(@PathVariable Integer idAlumno) {
        List<Curso> cursos = matriculaService.listarCursosPorAlumno(idAlumno);
        return ResponseEntity.ok(cursos);
    }

    /**
     * Registra la matrícula de un alumno en un curso específico para un ciclo académico.
     * @param payload Mapa que contiene idAlumno, idCurso y ciclo.
     * @return Confirmación de la matrícula exitosa.
     */
    @PostMapping("/registrar")
    @PreAuthorize("hasAuthority('admin')") // Solo el administrador realiza procesos de matrícula
    public ResponseEntity<?> matricularAlumno(@RequestBody Map<String, Object> payload) {
        try {
            // Extracción manual del JSON enviado desde el frontend
            Integer idAlumno = (Integer) payload.get("idAlumno");
            Integer idCurso = (Integer) payload.get("idCurso");
            String ciclo = (String) payload.get("ciclo");

            Matricula matricula = matriculaService.matricularAlumno(idAlumno, idCurso, ciclo);

            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Alumno matriculado exitosamente en " + matricula.getCurso().getNombreCurso());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Manejo de error interno (ej. el alumno ya estaba matriculado o el curso no existe)
            return ResponseEntity.internalServerError().body("Error en la matrícula: " + e.getMessage());
        }
    }

    /**
     * Elimina una matrícula (proceso de retiro de curso).
     * @param id ID único de la matrícula.
     */
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

    /**
     * Lista a todos los alumnos inscritos en un curso específico.
     * Transforma la entidad Matricula a un mapa simplificado para el frontend.
     * @param idCurso ID del curso a consultar.
     */
    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> listarAlumnosPorCurso(@PathVariable Integer idCurso) {
        List<Matricula> matriculas = matriculaService.listarMatriculasPorCurso(idCurso);

        // Transformación (Stream API) para enviar solo los datos necesarios del alumno
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