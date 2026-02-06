package com.cibertec.portal_academico.repositorios;

import com.cibertec.portal_academico.models.Tema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface TemaRepository extends JpaRepository<Tema, Integer> {
    @Query("SELECT t FROM Tema t WHERE t.unidad.id_unidad = :idUnidad")
    List<Tema> buscarPorUnidad(@Param("idUnidad") Integer idUnidad);
}