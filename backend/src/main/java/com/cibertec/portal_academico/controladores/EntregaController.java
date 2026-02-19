package com.cibertec.portal_academico.controladores;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cibertec.portal_academico.dto.EntregaDTO;
import com.cibertec.portal_academico.servicios.EntregaService;

@RestController
@RequestMapping("/api/entregas")
@CrossOrigin(origins = "*")
public class EntregaController {

    @Autowired
    private EntregaService entregaService;

    // VISTA DOCENTE: Ver quién entregó qué en una evaluación
    @GetMapping("/evaluacion/{idEval}/todas")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<List<EntregaDTO>> verTodasLasEntregas(@PathVariable Integer idEval) {
        return ResponseEntity.ok(entregaService.obtenerEntregasPorEvaluacion(idEval));
    }

    // VISTA ALUMNO: Ver mis propios intentos y mis notas
    @GetMapping("/evaluacion/{idEval}/mis-entregas/{idAlumno}")
    @PreAuthorize("hasAuthority('alumno')")
    public ResponseEntity<List<EntregaDTO>> verMisEntregas(
            @PathVariable Integer idEval,
            @PathVariable Integer idAlumno) {
        return ResponseEntity.ok(entregaService.obtenerMisEntregas(idEval, idAlumno));
    }

    // POST: El alumno sube su tarea
    @PostMapping("/enviar")
    @PreAuthorize("hasAuthority('alumno')")
    public ResponseEntity<?> enviarTarea(
            @RequestParam("idEvaluacion") Integer idEval,
            @RequestParam("idAlumno") Integer idAlumno,
            @RequestParam(value = "texto", required = false) String texto,
            @RequestParam(value = "archivo", required = false) MultipartFile archivo) {
        try {
            return new ResponseEntity<>(entregaService.realizarEntrega(idEval, idAlumno, texto, archivo),
                    HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT: El docente califica
    @PutMapping("/calificar/{idEntrega}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<?> calificar(
            @PathVariable Integer idEntrega,
            @RequestParam("nota") BigDecimal nota,
            @RequestParam(value = "comentario", required = false) String comentario) {
        return ResponseEntity.ok(entregaService.calificarEntrega(idEntrega, nota, comentario));
    }
}