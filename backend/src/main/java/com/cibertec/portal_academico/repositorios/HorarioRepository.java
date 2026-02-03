package com.cibertec.portal_academico.repositorios;

import com.cibertec.portal_academico.models.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Integer> {
    
    @Query("SELECT h FROM Horario h WHERE h.curso.id_curso = :idCurso ORDER BY h.horaInicio ASC")
    List<Horario> findByCursoId(@Param("idCurso") Integer idCurso);
}