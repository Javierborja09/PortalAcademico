package com.cibertec.portal_academico.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cibertec.portal_academico.models.Horario;

public interface HorarioRepository extends JpaRepository<Horario, Integer> {

    // Buscar horario asignados a un curso
    @Query("SELECT h FROM Horario h WHERE h.curso.id_curso = :idCurso")
    List<Horario> findByCursoId(@Param("idCurso") Integer idCurso);
}
