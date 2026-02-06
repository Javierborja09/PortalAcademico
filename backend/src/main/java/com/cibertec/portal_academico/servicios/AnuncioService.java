package com.cibertec.portal_academico.servicios;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cibertec.portal_academico.dto.AnuncioDTO;
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
    public Anuncio crearAnuncio(AnuncioDTO dto, String correoDocente) {
        Curso curso = cursoRepository.findById(dto.getIdCurso())
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        if (!curso.getDocente().getCorreo().equalsIgnoreCase(correoDocente)) {
            throw new RuntimeException("No tienes permiso: no estás asignado a este curso.");
        }

        LocalDate hoy = LocalDate.now();
        LocalDate fechaFinal = (dto.getFechaPublicacion() != null) ? dto.getFechaPublicacion() : hoy;

        if (fechaFinal.isAfter(hoy.plusDays(7))) {
            throw new RuntimeException("Solo se pueden programar anuncios hasta con 7 días de anticipación");
        }

        if (fechaFinal.isBefore(hoy)) {
            throw new RuntimeException("La fecha de publicación no puede ser anterior al día de hoy");
        }

        Anuncio anuncio = new Anuncio();
        anuncio.setCurso(curso);
        anuncio.setAutor(curso.getDocente());
        anuncio.setTitulo(dto.getTitulo());
        anuncio.setContenido(dto.getContenido());
        anuncio.setFechaPublicacion(fechaFinal);

        return anuncioRepository.save(anuncio);
    }

    @Transactional
    public Anuncio editarAnuncio(Integer idAnuncio, AnuncioDTO dto, String correoDocente) {
        Anuncio anuncio = anuncioRepository.findById(idAnuncio)
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado"));

        if (!anuncio.getCurso().getDocente().getCorreo().equalsIgnoreCase(correoDocente)) {
            throw new RuntimeException("No tienes permiso para editar anuncios de este curso.");
        }

        anuncio.setTitulo(dto.getTitulo());
        anuncio.setContenido(dto.getContenido());

        return anuncioRepository.save(anuncio);
    }

    @Transactional
    public void eliminarAnuncio(Integer id, String correoAutor) {
        Anuncio anuncio = anuncioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anuncio no encontrado"));

        if (!anuncio.getCurso().getDocente().getCorreo().equalsIgnoreCase(correoAutor)) {
            throw new RuntimeException("No tienes permiso para eliminar este anuncio");
        }

        anuncioRepository.delete(anuncio);
    }
}