package com.cibertec.portal_academico.controladores;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.cibertec.portal_academico.models.Anuncio;
import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.AnuncioRepository;
import com.cibertec.portal_academico.repositorios.CursoRepository;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;

@RestController
@RequestMapping("/api/anuncios")
@CrossOrigin(origins = "*")
public class AnuncioController {

    @Autowired
    private AnuncioRepository anuncioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 1 Listar anuncios visibles por curso (alumnos y docentes)
    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> listarPorCurso(@PathVariable Integer idCurso, Authentication authentication) {
        // 1. Extraemos los roles del usuario autenticado
        boolean esDocente = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("docente"));

        // 2. Pasamos el booleano al repositorio
        List<Anuncio> anuncios = anuncioRepository.listarPorRol(idCurso, esDocente);

        return ResponseEntity.ok(anuncios);
    }

    // 2 Crear anuncio (solo docente dueño del curso)
    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('docente')")
    public ResponseEntity<?> crearAnuncio(
            @RequestParam Integer idCurso,
            @RequestParam String titulo,
            @RequestParam String contenido,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaPublicacion,
            Authentication authentication) {

        try {
            // Obtener autor desde el token JWT
            Usuario autor = usuarioRepository.findByCorreo(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Validar existencia del curso
            Curso curso = cursoRepository.findById(idCurso)
                    .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

            // Validar que el docente que hace la petición sea el asignado al curso
            if (!curso.getDocente().getId_usuario().equals(autor.getId_usuario())) {
                return ResponseEntity.status(403).body("Error: No eres el docente asignado a este curso.");
            }

            // Lógica de fechas
            LocalDate hoy = LocalDate.now();
            LocalDate fechaFinal = (fechaPublicacion != null) ? fechaPublicacion : hoy;

            // Regla: No más de 7 días a futuro
            if (fechaFinal.isAfter(hoy.plusDays(7))) {
                return ResponseEntity.badRequest()
                        .body("Error: Solo se pueden programar anuncios hasta con 7 días de anticipación.");
            }

            // Regla: No fechas pasadas
            if (fechaFinal.isBefore(hoy)) {
                return ResponseEntity.badRequest()
                        .body("Error: La fecha de publicación no puede ser anterior al día de hoy.");
            }

            // Construir y guardar objeto
            Anuncio anuncio = new Anuncio();
            anuncio.setCurso(curso);
            anuncio.setAutor(autor);
            anuncio.setTitulo(titulo);
            anuncio.setContenido(contenido);
            anuncio.setFechaPublicacion(fechaFinal);

            anuncioRepository.save(anuncio);

            return ResponseEntity.ok("Anuncio publicado con éxito para el " + fechaFinal);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al procesar el anuncio: " + e.getMessage());
        }
    }

    // 3 Editar anuncio (solo el autor)
    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAuthority('docente')")
    public ResponseEntity<?> editarAnuncio(
            @PathVariable Integer id,
            @RequestParam String titulo,
            @RequestParam String contenido,
            Authentication authentication) {
        try {
            Anuncio anuncio = anuncioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Anuncio no encontrado"));

            // Validar que el que edita sea el autor
            if (!anuncio.getAutor().getCorreo().equals(authentication.getName())) {
                return ResponseEntity.status(403).body("No tienes permiso para editar este anuncio.");
            }

            anuncio.setTitulo(titulo);
            anuncio.setContenido(contenido);
            anuncioRepository.save(anuncio);

            return ResponseEntity.ok("Anuncio actualizado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // 4 Eliminar anuncio (solo el autor)
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('docente')")
    public ResponseEntity<?> eliminarAnuncio(@PathVariable Integer id, Authentication authentication) {
        try {
            Anuncio anuncio = anuncioRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Anuncio no encontrado"));

            if (!anuncio.getAutor().getCorreo().equals(authentication.getName())) {
                return ResponseEntity.status(403).body("No tienes permiso para eliminar este anuncio.");
            }

            anuncioRepository.delete(anuncio);
            return ResponseEntity.ok("Anuncio eliminado.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

}