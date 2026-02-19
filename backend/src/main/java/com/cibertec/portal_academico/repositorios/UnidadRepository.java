package com.cibertec.portal_academico.repositorios;

import com.cibertec.portal_academico.models.Unidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface UnidadRepository extends JpaRepository<Unidad, Integer> {
    @Query("SELECT u FROM Unidad u WHERE u.curso.id = :idCurso")
    List<Unidad> buscarPorCurso(@Param("idCurso") Integer idCurso);
}