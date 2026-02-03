package com.cibertec.portal_academico.repositorios;

import com.cibertec.portal_academico.models.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MatriculaRepository extends JpaRepository<Matricula, Integer> {
    
    // Busca todas las matrículas de un alumno específico
    @Query("SELECT m FROM Matricula m WHERE m.alumno.id_usuario = :idAlumno")
    List<Matricula> findByAlumnoId(@Param("idAlumno") Integer idAlumno);

    @Query("SELECT m FROM Matricula m WHERE m.curso.id_curso = :idCurso")
    List<Matricula> findByCursoId(@Param("idCurso") Integer idCurso);

    @Modifying
    @Query("DELETE FROM Matricula m WHERE m.alumno.id_usuario = :idAlumno AND m.curso.id_curso = :idCurso")
    void deleteByAlumnoAndCurso(@Param("idAlumno") Integer idAlumno, @Param("idCurso") Integer idCurso);
}