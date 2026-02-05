package com.cibertec.portal_academico.controladores;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.cibertec.portal_academico.servicios.AnuncioService;

@RestController
@RequestMapping("/api/anuncios")
@CrossOrigin(origins = "*")
public class AnuncioController {

    @Autowired
    private AnuncioService anuncioService;

    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> listarPorCurso(@PathVariable Integer idCurso, Authentication authentication) {
        boolean esDocente = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("docente"));

        return ResponseEntity.ok(anuncioService.listarPorCurso(idCurso, esDocente));
    }

    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('docente')")
    public ResponseEntity<?> crearAnuncio(
            @RequestParam Integer idCurso,
            @RequestParam String titulo,
            @RequestParam String contenido,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaPublicacion,
            Authentication authentication) {
        try {
            anuncioService.crearAnuncio(idCurso, titulo, contenido, fechaPublicacion, authentication.getName());
            return ResponseEntity.ok("Anuncio publicado con éxito");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAuthority('docente')")
    public ResponseEntity<?> editarAnuncio(
            @PathVariable Integer id,
            @RequestParam String titulo,
            @RequestParam String contenido,
            Authentication authentication) {
        try {
            anuncioService.editarAnuncio(id, titulo, contenido, authentication.getName());
            return ResponseEntity.ok("Anuncio actualizado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('docente')")
    public ResponseEntity<?> eliminarAnuncio(@PathVariable Integer id, Authentication authentication) {
        try {
            anuncioService.eliminarAnuncio(id, authentication.getName());
            return ResponseEntity.ok("Anuncio eliminado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}