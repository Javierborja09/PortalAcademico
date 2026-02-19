package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.servicios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * Controlador REST para la gestión de Usuarios y Perfiles.
 * Maneja el ciclo de vida de las cuentas y la carga de imágenes de perfil.
 */
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Recupera la lista completa de usuarios registrados.
     * @return ResponseEntity con la lista de todos los usuarios (Alumnos, Docentes y Admins).
     */
    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('admin')") // Solo el administrador puede auditar la lista total
    public ResponseEntity<?> listarUsuarios() {
        try {
            return ResponseEntity.ok(usuarioService.listarTodos());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    /**
     * Busca usuarios mediante una coincidencia de nombre.
     * @param nombre Cadena de texto a buscar.
     * @return Lista de usuarios que coinciden con el criterio.
     */
    @GetMapping("/buscar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> buscarPorNombre(@RequestParam("nombre") String nombre) {
        return ResponseEntity.ok(usuarioService.buscarPorNombre(nombre));
    }

    /**
     * Registra un nuevo usuario en el sistema con soporte para carga de avatar.
     * @param foto Archivo de imagen de perfil opcional.
     * @return Mensaje de confirmación del registro.
     */
    @PostMapping("/registrar")
    @PreAuthorize("hasAuthority('admin')") // La creación de cuentas institucionales es potestad del Admin
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

    /**
     * Actualiza los datos de un usuario existente. 
     * Este método permite tanto la edición administrativa como la actualización de perfil propio.
     * @param id ID del usuario a editar.
     * @param foto Nuevo archivo de imagen (opcional).
     * @return Mapa con mensaje de éxito y la nueva ruta de la foto de perfil.
     */
    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAuthority('admin') or isAuthenticated()") // El admin puede editar a todos, y el usuario a sí mismo
    public ResponseEntity<?> editarPerfil(
            @PathVariable Integer id,
            @RequestParam(value = "nombre", required = false) String nombre,
            @RequestParam(value = "apellido", required = false) String apellido,
            @RequestParam(value = "rol", required = false) String rol,
            @RequestParam(value = "correo", required = false) String correo,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {
        try {
            // Se delega al servicio la actualización y el guardado físico de la imagen si existe
            Usuario usuario = usuarioService.editarUsuario(id, nombre, apellido, rol, correo, password, foto);
            
            return ResponseEntity.ok(Map.of(
                "mensaje", "Usuario actualizado", 
                "foto", usuario.getFoto_perfil()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}