package com.cibertec.portal_academico.controladores;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    // 1️⃣ Listar anuncios visibles por curso
    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> listarPorCurso(@PathVariable Integer idCurso) {

        List<Anuncio> anuncios = anuncioRepository.listarVisiblesPorCurso(idCurso);
        return ResponseEntity.ok(anuncios);
    }

    // 2️⃣ Crear anuncio (solo docente)
    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('docente')")
    public ResponseEntity<?> crearAnuncio(
            @RequestParam Integer idCurso,
            @RequestParam String titulo,
            @RequestParam String contenido,
            @RequestParam(required = false) String fechaPublicacion,
            Authentication authentication) {

        Usuario autor = usuarioRepository.findByCorreo(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Curso curso = cursoRepository.findById(idCurso)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        // Validar que el docente sea dueño del curso
        if (!curso.getDocente().getId_usuario().equals(autor.getId_usuario())) {
            return ResponseEntity.status(403).body("No eres docente de este curso");
        }

        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime fechaFinal = (fechaPublicacion != null)
                ? LocalDateTime.parse(fechaPublicacion)
                : ahora;

        // Límite de 7 días (solo lógica, no BD)
        if (fechaFinal.isAfter(ahora.plusDays(7))) {
            return ResponseEntity.badRequest()
                    .body("Solo se puede programar anuncios hasta 7 días");
        }

        Anuncio anuncio = new Anuncio();
        anuncio.setCurso(curso);
        anuncio.setAutor(autor);
        anuncio.setTitulo(titulo);
        anuncio.setContenido(contenido);
        anuncio.setFechaPublicacion(fechaFinal);

        anuncioRepository.save(anuncio);

        return ResponseEntity.ok("Anuncio creado correctamente");
    }


}
