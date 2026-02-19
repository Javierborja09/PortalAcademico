package com.cibertec.portal_academico.repositorios;

import com.cibertec.portal_academico.models.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface MatriculaRepository extends JpaRepository<Matricula, Integer> {
    
    // 1. Cargamos el curso y el docente del curso de un solo golpe para el perfil del alumno
    @Query("SELECT m FROM Matricula m " +
           "JOIN FETCH m.curso c " +
           "JOIN FETCH c.docente " +
           "WHERE m.alumno.id_usuario = :idAlumno")
    List<Matricula> findByAlumnoId(@Param("idAlumno") Integer idAlumno);

    // 2. Para el docente: Listar todos los alumnos matriculados en su curso
    @Query("SELECT m FROM Matricula m " +
           "JOIN FETCH m.alumno " +
           "WHERE m.curso.id_curso = :idCurso")
    List<Matricula> findByCursoId(@Param("idCurso") Integer idCurso);

    // 3. Eliminación personalizada (Requiere @Transactional y @Modifying)
    @Transactional
    @Modifying
    @Query("DELETE FROM Matricula m WHERE m.alumno.id_usuario = :idAlumno AND m.curso.id_curso = :idCurso")
    void deleteByAlumnoAndCurso(@Param("idAlumno") Integer idAlumno, @Param("idCurso") Integer idCurso);
    
    // 4. Bonus: Verificar si ya existe la matrícula antes de insertar (para evitar duplicados)
    @Query("SELECT COUNT(m) > 0 FROM Matricula m WHERE m.alumno.id_usuario = :idAlumno AND m.curso.id_curso = :idCurso")
    boolean existsByAlumnoAndCurso(@Param("idAlumno") Integer idAlumno, @Param("idCurso") Integer idCurso);
}