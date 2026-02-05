package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.servicios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> listarUsuarios() {
        try {
            return ResponseEntity.ok(usuarioService.listarTodos());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/buscar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> buscarPorNombre(@RequestParam("nombre") String nombre) {
        return ResponseEntity.ok(usuarioService.buscarPorNombre(nombre));
    }

    @PostMapping("/registrar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> registrarUsuario(
            @RequestParam("nombre") String nombre,
            @RequestParam("apellido") String apellido,
            @RequestParam("correo") String correo,
            @RequestParam("password") String password,
            @RequestParam("rol") String rol,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {
        try {
            usuarioService.registrarUsuario(nombre, apellido, correo, password, rol, foto);
            return ResponseEntity.ok("Registrado con éxito");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAuthority('admin') or isAuthenticated()")
    public ResponseEntity<?> editarPerfil(
            @PathVariable Integer id,
            @RequestParam(value = "nombre", required = false) String nombre,
            @RequestParam(value = "apellido", required = false) String apellido,
            @RequestParam(value = "rol", required = false) String rol,
            @RequestParam(value = "correo", required = false) String correo,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {
        try {
            Usuario usuario = usuarioService.editarUsuario(id, nombre, apellido, rol, correo, password, foto);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario actualizado", "foto", usuario.getFoto_perfil()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}