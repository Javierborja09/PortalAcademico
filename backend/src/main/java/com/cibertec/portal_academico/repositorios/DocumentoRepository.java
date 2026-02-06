package com.cibertec.portal_academico.repositorios;

import com.cibertec.portal_academico.models.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Integer> {

    // Usamos @Query manual para evitar el conflicto con el guion bajo 'id_tema'
    @Query("SELECT d FROM Documento d WHERE d.tema.id_tema = :idTema")
    List<Documento> buscarPorTema(@Param("idTema") Integer idTema);
}