package com.cibertec.portal_academico.controladores;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cibertec.portal_academico.models.Evaluacion;
import com.cibertec.portal_academico.servicios.EvaluacionService;

@RestController
@RequestMapping("/api/evaluaciones")
@CrossOrigin(origins = "*")
public class EvaluacionController {
    @Autowired
    private EvaluacionService evaluacionService;

    // Listar evaluaciones para alumnos y docentes
    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Evaluacion>> listarPorCurso(@PathVariable Integer idCurso) {
        return ResponseEntity.ok(evaluacionService.listarPorCurso(idCurso));
    }

    // Crear evaluación - Solo DOCENTE o ADMIN
    @PostMapping("/crear")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<?> crearEvaluacion(
            @RequestParam("idCurso") Integer idCurso,
            @RequestParam("titulo") String titulo,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("fechaLimite") String fechaLimite,
            @RequestParam("intentos") Integer intentos,
            @RequestParam(value = "archivo", required = false) MultipartFile archivo) {
        try {
            Evaluacion nueva = evaluacionService.crearEvaluacion(idCurso, titulo, descripcion, fechaLimite, intentos,
                    archivo);
            return new ResponseEntity<>(nueva, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error al crear evaluación: " + e.getMessage());
        }
    }

    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<?> editarEvaluacion(
            @PathVariable Integer id,
            @RequestParam(value = "titulo", required = false) String titulo,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam(value = "fechaLimite", required = false) String fechaLimite,
            @RequestParam(value = "intentos", required = false) Integer intentos,
            @RequestParam(value = "archivo", required = false) MultipartFile archivo) {
        try {
            Evaluacion editada = evaluacionService.editarEvaluacion(id, titulo, descripcion, fechaLimite, intentos,
                    archivo);
            return ResponseEntity.ok(editada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al editar evaluación: " + e.getMessage());
        }
    }

    // Eliminar evaluación - Solo DOCENTE o ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<Void> eliminarEvaluacion(@PathVariable Integer id) {
        evaluacionService.eliminarEvaluacion(id);
        return ResponseEntity.noContent().build();
    }
}
