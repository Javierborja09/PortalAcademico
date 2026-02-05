package com.cibertec.portal_academico.repositorios;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.cibertec.portal_academico.models.Anuncio;

public interface AnuncioRepository extends JpaRepository<Anuncio, Integer> {

    @Query("SELECT a FROM Anuncio a " +
           "JOIN FETCH a.autor " +
           "JOIN FETCH a.curso " +
           "WHERE a.curso.id_curso = :idCurso " +
           "AND a.fechaPublicacion <= CURRENT_DATE " +
           "ORDER BY a.fechaPublicacion DESC")
    List<Anuncio> listarVisiblesPorCurso(@Param("idCurso") Integer idCurso);

    @Query("SELECT a FROM Anuncio a " +
           "JOIN FETCH a.autor " +
           "JOIN FETCH a.curso " +
           "WHERE a.curso.id_curso = :idCurso " +
           "AND (:esDocente = true OR a.fechaPublicacion <= CURRENT_DATE) " +
           "ORDER BY a.fechaPublicacion DESC")
    List<Anuncio> listarPorRol(@Param("idCurso") Integer idCurso, @Param("esDocente") boolean esDocente);
}