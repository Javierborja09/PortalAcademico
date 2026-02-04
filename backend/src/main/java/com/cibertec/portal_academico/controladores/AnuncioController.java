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

    // 1️⃣ Listar anuncios visibles por curso (alumnos y docentes)
    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> listarPorCurso(@PathVariable Integer idCurso) {
        // La lógica de "vencimiento" o "visibilidad" está en la Query del Repo
        List<Anuncio> anuncios = anuncioRepository.listarVisiblesPorCurso(idCurso);
        return ResponseEntity.ok(anuncios);
    }

    // 2️⃣ Crear anuncio (solo docente dueño del curso)
    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('docente')")
    public ResponseEntity<?> crearAnuncio(
            @RequestParam Integer idCurso,
            @RequestParam String titulo,
            @RequestParam String contenido,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaPublicacion,
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
}