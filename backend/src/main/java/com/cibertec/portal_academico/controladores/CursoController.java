package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.servicios.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador para la gestión integral de Cursos.
 * Maneja operaciones CRUD y filtrado de cursos por roles de usuario.
 */
@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    /**
     * Lista todos los cursos existentes en el sistema.
     * Restringido exclusivamente al rol Administrador.
     */
    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> listarTodos() {
        return ResponseEntity.ok(cursoService.listarTodos());
    }

    /**
     * Crea un nuevo curso incluyendo la carga de imagen de portada.
     * @param imagen Archivo de imagen opcional (MultipartFile).
     * @return Mensaje de éxito y la ruta de la imagen generada.
     */
    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> crearCurso(
            @RequestParam("nombreCurso") String nombre,
            @RequestParam("codigoCurso") String codigo,
            @RequestParam("fechaInicio") String fechaInicio,
            @RequestParam("fechaFin") String fechaFin,
            @RequestParam("idDocente") Integer idDocente,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        try {
            Curso curso = cursoService.crearCurso(nombre, codigo, fechaInicio, fechaFin, idDocente, imagen);
            
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Curso creado con éxito");
            respuesta.put("imagen", curso.getImagenPortada());
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Actualiza los datos de un curso existente.
     * Los parámetros son opcionales (required = false) para permitir ediciones parciales.
     */
    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> editarCurso(
            @PathVariable Integer id,
            @RequestParam(value = "nombreCurso", required = false) String nombre,
            @RequestParam(value = "codigoCurso", required = false) String codigo,
            @RequestParam(value = "fechaInicio", required = false) String fechaInicio,
            @RequestParam(value = "fechaFin", required = false) String fechaFin,
            @RequestParam(value = "idDocente", required = false) Integer idDocente,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        try {
            Curso curso = cursoService.editarCurso(id, nombre, codigo, fechaInicio, fechaFin, idDocente, imagen);
            
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Curso actualizado correctamente");
            respuesta.put("imagen", curso.getImagenPortada());
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Elimina un curso por su ID.
     */
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> eliminarCurso(@PathVariable Integer id) {
        try {
            cursoService.eliminarCurso(id);
            return ResponseEntity.ok("Curso eliminado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Lista los cursos asignados a un docente específico.
     */
    @GetMapping("/docente/{idDocente}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<?> listarPorDocente(@PathVariable Integer idDocente) {
        return ResponseEntity.ok(cursoService.listarPorDocente(idDocente));
    }

    /**
     * Lista los cursos en los que un alumno está matriculado.
     */
    @GetMapping("/alumno/{idAlumno}")
    @PreAuthorize("hasAnyAuthority('alumno', 'admin')")
    public ResponseEntity<?> listarPorAlumno(@PathVariable Integer idAlumno) {
        return ResponseEntity.ok(cursoService.listarPorAlumno(idAlumno));
    }

    /**
     * Obtiene el detalle de un curso validando que el usuario tenga acceso.
     * @param authentication Datos del usuario en sesión para verificar pertenencia al curso.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id, Authentication authentication) {
        try {
            Curso curso = cursoService.obtenerPorId(id);
            
            // Extraer email y rol para validar seguridad a nivel de contenido
            String email = authentication.getName();
            String rol = authentication.getAuthorities().iterator().next()
                    .getAuthority().toLowerCase();

            // Validar si el usuario (Alumno/Docente) realmente pertenece a este curso
            if (!cursoService.tieneAcceso(id, email, rol)) {
                return ResponseEntity.status(403).body("Acceso denegado: No perteneces a este curso.");
            }

            return ResponseEntity.ok(curso);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}