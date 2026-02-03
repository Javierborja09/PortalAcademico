package com.cibertec.portal_academico.repositorios;

import com.cibertec.portal_academico.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    // Método clave para la autenticación
    Optional<Usuario> findByCorreo(String correo);

    List<Usuario> findByNombreContainingIgnoreCase(String nombre);
}