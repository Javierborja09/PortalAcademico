package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Documento;
import com.cibertec.portal_academico.models.Tema;
import com.cibertec.portal_academico.models.Unidad;
import com.cibertec.portal_academico.servicios.ContenidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Controlador para la gestión de Unidades y Temas del curso.
 */
@RestController
@RequestMapping("/api/contenido")
@CrossOrigin(origins = "*")
public class ContenidoController {

    @Autowired
    private ContenidoService contenidoService;

    // ==========================================
    // ESTRUCTURA COMPLETA (JSON JERÁRQUICO)
    // ==========================================

    @GetMapping("/curso/{idCurso}/todo")
    @PreAuthorize("isAuthenticated()") // Estudiantes, docentes y admin
    public ResponseEntity<List<Map<String, Object>>> listarTodoElContenido(@PathVariable Integer idCurso) {
        // Retorna el JSON estructurado con Unidades -> Temas -> Documentos
        return ResponseEntity.ok(contenidoService.obtenerContenidoFull(idCurso));
    }

    // ==========================================
    // ENDPOINTS DE UNIDADES
    // ==========================================

    @PostMapping("/unidades")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<Unidad> crearUnidad(@RequestBody Unidad unidad) {
        // El orden se maneja implícitamente por ID o por el SELECT estructurado
        return new ResponseEntity<>(contenidoService.guardarUnidad(unidad), HttpStatus.CREATED);
    }

    @PutMapping("/unidad/{id}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<Unidad> actualizarUnidad(@PathVariable Integer id, @RequestBody Unidad unidad) {
        // Solo actualiza el título según la nueva lógica del service
        return ResponseEntity.ok(contenidoService.actualizarUnidad(id, unidad));
    }

    @DeleteMapping("/unidad/{id}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<Void> eliminarUnidad(@PathVariable Integer id) {
        contenidoService.eliminarUnidad(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // ENDPOINTS DE TEMAS
    // ==========================================

    @PostMapping("/temas")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<Tema> crearTema(@RequestBody Tema tema) {
        return new ResponseEntity<>(contenidoService.guardarTema(tema), HttpStatus.CREATED);
    }

    @PutMapping("/tema/{id}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<Tema> actualizarTema(@PathVariable Integer id, @RequestBody Tema tema) {
        // Solo actualiza título y descripción
        return ResponseEntity.ok(contenidoService.actualizarTema(id, tema));
    }

    @DeleteMapping("/tema/{id}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<Void> eliminarTema(@PathVariable Integer id) {
        contenidoService.eliminarTema(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/documentos/subir")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<Documento> subirDocumento(
            @RequestParam("idTema") Integer idTema,
            @RequestParam("titulo") String titulo,
            @RequestPart("archivo") MultipartFile archivo) {
        
        return new ResponseEntity<>(contenidoService.guardarDocumento(idTema, titulo, archivo), HttpStatus.CREATED);
    }

    @DeleteMapping("/documento/{id}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')")
    public ResponseEntity<Void> eliminarDocumento(@PathVariable Integer id) {
        contenidoService.eliminarDocumento(id);
        return ResponseEntity.noContent().build();
    }
}