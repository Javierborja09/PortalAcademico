package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.dto.LoginRequestDTO;
import com.cibertec.portal_academico.dto.LoginResponseDTO;
import com.cibertec.portal_academico.servicios.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controlador encargado de los procesos de autenticación y seguridad.
 * Provee los endpoints necesarios para el inicio de sesión y gestión de tokens.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite la conexión desde el frontend (React/Angular/Vue)
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Endpoint para la autenticación de usuarios.
     * Recibe las credenciales, las valida y retorna un token JWT junto con los datos del usuario.
     * * @param request Objeto DTO que contiene 'correo' y 'password'.
     * @return ResponseEntity con el LoginResponseDTO (éxito) o un mensaje de error (401).
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        try {
            // Llama al servicio de autenticación para validar credenciales y generar el token
            LoginResponseDTO response = authService.autenticar(
                    request.getCorreo(), 
                    request.getPassword()
            );
            
            // Si todo es correcto, devuelve los datos del usuario y su token JWT
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            /* * Manejo de error de autenticación:
             * Se retorna un código 401 (Unauthorized) con un JSON descriptivo.
             * Nota: Se usa un mapa genérico para enviar el mensaje de error de forma estructurada.
             */
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Correo o contraseña incorrectos"));
        }
    }
}