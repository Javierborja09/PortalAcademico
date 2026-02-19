package com.cibertec.portal_academico.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cibertec.portal_academico.models.Entrega;

@Repository
public interface EntregaRepository extends JpaRepository<Entrega, Integer>{
    // Para que el alumno vea sus intentos en una evaluación
    @Query("SELECT e FROM Entrega e WHERE e.evaluacion.id_evaluacion = :idEval " +
           "AND e.alumno.id_usuario = :idAlu ORDER BY e.intentoNumero DESC")
    List<Entrega> buscarPorEvaluacionYAlumno(
        @Param("idEval") Integer idEval, 
        @Param("idAlu") Integer idAlu
    );
    // Para que el docente vea todas las entregas de una evaluación
    @Query("SELECT e FROM Entrega e WHERE e.evaluacion.id_evaluacion = :idEval")
    List<Entrega> buscarPorEvaluacion(@Param("idEval") Integer idEval);
}
