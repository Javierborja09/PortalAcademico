package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.dto.LoginRequestDTO;
import com.cibertec.portal_academico.dto.LoginResponseDTO;
import com.cibertec.portal_academico.servicios.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        try {
            LoginResponseDTO response = authService.autenticar(
                    request.getCorreo(), 
                    request.getPassword()
            );
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Correo o contraseña incorrectos"));
        }
    }
}