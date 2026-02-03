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

    // VALIDACIÓN DE SEGURIDAD: Verifica si el alumno tiene una matrícula activa en el curso
    @Query("SELECT COUNT(m) > 0 FROM Matricula m WHERE m.curso.id = :cursoId AND m.alumno.correo = :email")
    boolean existsByCursoIdAndAlumnoEmail(@Param("cursoId") Integer cursoId, @Param("email") String email);
    
    // VALIDACIÓN PARA DOCENTE: Verifica si es el profesor del curso
    @Query("SELECT COUNT(c) > 0 FROM Curso c WHERE c.id = :cursoId AND c.docente.correo = :email")
    boolean existsByCursoIdAndDocenteEmail(@Param("cursoId") Integer cursoId, @Param("email") String email);
}