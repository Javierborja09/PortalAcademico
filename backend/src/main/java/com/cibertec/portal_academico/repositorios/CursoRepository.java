package com.cibertec.portal_academico.repositorios;

import com.cibertec.portal_academico.models.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {

    // 1. Cursos del docente que NO han finalizado
    @Query("SELECT c FROM Curso c JOIN FETCH c.docente " +
           "WHERE c.docente.id_usuario = :idDocente " +
           "AND c.fechaFin >= CURRENT_DATE")
    List<Curso> findByDocenteId(@Param("idDocente") Integer idDocente);

    // 2. Cursos del alumno que NO han finalizado
    @Query("SELECT m.curso FROM Matricula m JOIN m.curso c JOIN FETCH c.docente " +
           "WHERE m.alumno.id_usuario = :idAlumno " +
           "AND c.fechaFin >= CURRENT_DATE")  
    List<Curso> findCursosByAlumnoId(@Param("idAlumno") Integer idAlumno);

    // 3. Validación de matrícula     
    @Query("SELECT COUNT(m) > 0 FROM Matricula m WHERE m.curso.id_curso = :cursoId AND m.alumno.correo = :email")
    boolean existsByCursoIdAndAlumnoEmail(@Param("cursoId") Integer cursoId, @Param("email") String email);
    
    // 4. Validación de docente
    @Query("SELECT COUNT(c) > 0 FROM Curso c WHERE c.id_curso = :cursoId AND c.docente.correo = :email")
    boolean existsByCursoIdAndDocenteEmail(@Param("cursoId") Integer cursoId, @Param("email") String email);
}