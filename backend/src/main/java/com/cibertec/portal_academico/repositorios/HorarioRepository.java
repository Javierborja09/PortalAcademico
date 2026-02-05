package com.cibertec.portal_academico.repositorios;

import com.cibertec.portal_academico.models.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Integer> {
    
    // Usamos JOIN FETCH para traer los datos del curso de una vez. 
    // Si Horario tiene relación con 'Aula', también deberías agregarle un JOIN FETCH h.aula
    @Query("SELECT h FROM Horario h " +
           "JOIN FETCH h.curso " + 
           "WHERE h.curso.id_curso = :idCurso " +
           "ORDER BY h.diaSemana ASC, h.horaInicio ASC")
    List<Horario> findByCursoId(@Param("idCurso") Integer idCurso);
}