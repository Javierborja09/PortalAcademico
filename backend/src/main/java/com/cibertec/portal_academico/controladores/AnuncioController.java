package com.cibertec.portal_academico.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.cibertec.portal_academico.dto.AnuncioDTO;
import com.cibertec.portal_academico.servicios.AnuncioService;

/**
 * Controlador REST para la gestión de anuncios de cursos.
 * Proporciona endpoints para listar, crear, editar y eliminar anuncios.
 */
@RestController
@RequestMapping("/api/anuncios")
@CrossOrigin(origins = "*") 
public class AnuncioController {

    @Autowired
    private AnuncioService anuncioService;

    /**
     * Obtiene la lista de anuncios de un curso específico.
     * @param idCurso ID del curso a consultar.
     * @param authentication Información del usuario autenticado (inyectado por Spring Security).
     * @return Lista de anuncios filtrada según el rol del usuario.
     */
    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("isAuthenticated()") // Cualquier usuario con sesión activa puede consultar
    public ResponseEntity<?> listarPorCurso(@PathVariable Integer idCurso, Authentication authentication) {
        // Verifica si el usuario autenticado tiene el rol de 'docente'
        boolean esDocente = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("docente"));

        // El servicio decidirá si muestra anuncios ocultos/borradores si es docente
        return ResponseEntity.ok(anuncioService.listarPorCurso(idCurso, esDocente));
    }

    /**
     * Crea un nuevo anuncio para un curso.
     * @param idCurso ID del curso al que pertenece el anuncio.
     * @param titulo Título informativo.
     * @param contenido Cuerpo del anuncio.
     * @param fechaPublicacion Fecha opcional (ISO yyyy-MM-dd).
     * @param authentication Datos del docente que crea el anuncio.
     */
   @PostMapping("/crear")
    @PreAuthorize("hasAuthority('docente')")
    public ResponseEntity<?> crearAnuncio(@RequestBody AnuncioDTO dto, Authentication auth) {
        try {
            anuncioService.crearAnuncio(dto, auth.getName());
            return ResponseEntity.ok("Anuncio publicado con éxito");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Edita un anuncio existente.
     * @param id ID del anuncio a modificar.
     * @param titulo Nuevo título.
     * @param contenido Nuevo contenido.
     */
    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAuthority('docente')")
    public ResponseEntity<?> editarAnuncio(@PathVariable Integer id, @RequestBody AnuncioDTO dto, Authentication auth) {
        try {
            anuncioService.editarAnuncio(id, dto, auth.getName());
            return ResponseEntity.ok("Anuncio actualizado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Elimina un anuncio del sistema.
     * @param id ID del anuncio a eliminar.
     */
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('docente')") // Solo docentes pueden eliminar
    public ResponseEntity<?> eliminarAnuncio(@PathVariable Integer id, Authentication authentication) {
        try {
            anuncioService.eliminarAnuncio(id, authentication.getName());
            return ResponseEntity.ok("Anuncio eliminado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}