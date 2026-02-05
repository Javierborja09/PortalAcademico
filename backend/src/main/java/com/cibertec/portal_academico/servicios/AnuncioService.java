package com.cibertec.portal_academico.servicios;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cibertec.portal_academico.models.Anuncio;
import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.AnuncioRepository;
import com.cibertec.portal_academico.repositorios.CursoRepository;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;

@Service
public class AnuncioService {

    @Autowired
    private AnuncioRepository anuncioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Anuncio> listarPorCurso(Integer idCurso, boolean esDocente) {
        return anuncioRepository.listarPorRol(idCurso, esDocente);
    }

    @Transactional
    public Anuncio crearAnuncio(Integer idCurso, String titulo, String contenido, 
                                LocalDate fechaPublicacion, String correoAutor) {
        
        Usuario autor = usuarioRepository.findByCorreo(correoAutor)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Curso curso = cursoRepository.findById(idCurso)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        // Validar que el docente sea el asignado al curso
        if (!curso.getDocente().getId_usuario().equals(autor.getId_usuario())) {
            throw new RuntimeException("No eres el docente asignado a este curso");
        }

        // Lógica de fechas
        LocalDate hoy = LocalDate.now();
        LocalDate fechaFinal = (fechaPublicacion != null) ? fechaPublicacion : hoy;

        if (fechaFinal.isAfter(hoy.plusDays(7))) {
            throw new RuntimeException("Solo se pueden programar anuncios hasta con 7 días de anticipación");
        }

        if (fechaFinal.isBefore(hoy)) {
            throw new RuntimeException("La fecha de publicación no puede ser anterior al día de hoy");
        }

        Anuncio anuncio = new Anuncio();
        anuncio.setCurso(curso);
        anuncio.setAutor(autor);
        anuncio.setTitulo(titulo);
        anuncio.setContenido(contenido);
        anuncio.setFechaPublicacion(fechaFinal);

        return anuncioRepository.save(anuncio);
    }

    @Transactional
    public Anuncio editarAnuncio(Integer id, String titulo, String contenido, String correoAutor) {
        Anuncio anuncio = anuncioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado"));

        if (!anuncio.getAutor().getCorreo().equals(correoAutor)) {
            throw new RuntimeException("No tienes permiso para editar este anuncio");
        }

        anuncio.setTitulo(titulo);
        anuncio.setContenido(contenido);
        
        return anuncioRepository.save(anuncio);
    }

    @Transactional
    public void eliminarAnuncio(Integer id, String correoAutor) {
        Anuncio anuncio = anuncioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado"));

        if (!anuncio.getAutor().getCorreo().equals(correoAutor)) {
            throw new RuntimeException("No tienes permiso para eliminar este anuncio");
        }

        anuncioRepository.delete(anuncio);
    }
}