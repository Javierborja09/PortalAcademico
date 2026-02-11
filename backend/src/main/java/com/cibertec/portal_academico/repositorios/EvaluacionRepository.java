package com.cibertec.portal_academico.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cibertec.portal_academico.models.Evaluacion;

@Repository
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Integer>{
    @Query("SELECT e FROM Evaluacion e WHERE e.curso.id_curso = :idCurso ORDER BY e.fechaCreacion DESC")
    List<Evaluacion> findByCursoId(@Param("idCurso") Integer idCurso);
}
