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

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> listarTodos() {
        return ResponseEntity.ok(cursoService.listarTodos());
    }

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

    @GetMapping("/docente/{idDocente}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<?> listarPorDocente(@PathVariable Integer idDocente) {
        return ResponseEntity.ok(cursoService.listarPorDocente(idDocente));
    }

    @GetMapping("/alumno/{idAlumno}")
    @PreAuthorize("hasAnyAuthority('alumno', 'admin')")
    public ResponseEntity<?> listarPorAlumno(@PathVariable Integer idAlumno) {
        return ResponseEntity.ok(cursoService.listarPorAlumno(idAlumno));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id, Authentication authentication) {
        try {
            Curso curso = cursoService.obtenerPorId(id);
            
            String email = authentication.getName();
            String rol = authentication.getAuthorities().iterator().next()
                    .getAuthority().toLowerCase();

            if (!cursoService.tieneAcceso(id, email, rol)) {
                return ResponseEntity.status(403).body("Acceso denegado: No perteneces a este curso.");
            }

            return ResponseEntity.ok(curso);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}