package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;
import com.cibertec.portal_academico.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String correo = request.get("correo");
        String password = request.get("password");

        Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);

        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            Usuario usuario = userOpt.get();
            
            // Generamos el token
            String rolString = usuario.getRol().toString(); 
            String token = jwtUtil.generateToken(correo, rolString); 
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("nombre", usuario.getNombre());
            response.put("rol", rolString);
            response.put("userId", usuario.getId_usuario());
            response.put("foto", usuario.getFoto_perfil());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(Map.of("message", "Correo o contraseña incorrectos"));
    }
}