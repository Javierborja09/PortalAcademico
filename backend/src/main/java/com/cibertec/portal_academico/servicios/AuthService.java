package com.cibertec.portal_academico.servicios;

import com.cibertec.portal_academico.dto.LoginResponseDTO;
import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;
import com.cibertec.portal_academico.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponseDTO autenticar(String correo, String password) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String rolString = usuario.getRol().toString();
        String token = jwtUtil.generateToken(correo, rolString);

        return new LoginResponseDTO(
                token,
                usuario.getNombre(),
                usuario.getApellido(),
                rolString,
                usuario.getId_usuario(),
                usuario.getFoto_perfil()
        );
    }
}