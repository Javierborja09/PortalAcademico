package com.cibertec.portal_academico.repositorios;

import com.cibertec.portal_academico.models.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {

    // Buscar cursos asignados a un docente
    @Query("SELECT c FROM Curso c WHERE c.docente.id_usuario = :idDocente")
    List<Curso> findByDocenteId(@Param("idDocente") Integer idDocente);

    // Buscar cursos donde un alumno está matriculado
    @Query("SELECT m.curso FROM Matricula m WHERE m.alumno.id_usuario = :idAlumno")
    List<Curso> findCursosByAlumnoId(@Param("idAlumno") Integer idAlumno);
}