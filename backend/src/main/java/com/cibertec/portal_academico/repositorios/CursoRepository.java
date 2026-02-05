package com.cibertec.portal_academico.repositorios;

import com.cibertec.portal_academico.models.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {

    // 1. Agregamos JOIN FETCH para cargar al docente de una vez y evitar múltiples selects
    @Query("SELECT c FROM Curso c JOIN FETCH c.docente WHERE c.docente.id_usuario = :idDocente")
    List<Curso> findByDocenteId(@Param("idDocente") Integer idDocente);

    // 2. Traemos los cursos del alumno cargando también la información del docente del curso
    @Query("SELECT m.curso FROM Matricula m JOIN m.curso c JOIN FETCH c.docente WHERE m.alumno.id_usuario = :idAlumno")
    List<Curso> findCursosByAlumnoId(@Param("idAlumno") Integer idAlumno);

    // 3. Validación de matrícula (Cambié 'id' por 'id_curso' para que coincida con tu modelo de Anuncio)
    @Query("SELECT COUNT(m) > 0 FROM Matricula m WHERE m.curso.id_curso = :cursoId AND m.alumno.correo = :email")
    boolean existsByCursoIdAndAlumnoEmail(@Param("cursoId") Integer cursoId, @Param("email") String email);
    
    // 4. Validación de docente
    @Query("SELECT COUNT(c) > 0 FROM Curso c WHERE c.id_curso = :cursoId AND c.docente.correo = :email")
    boolean existsByCursoIdAndDocenteEmail(@Param("cursoId") Integer cursoId, @Param("email") String email);
}