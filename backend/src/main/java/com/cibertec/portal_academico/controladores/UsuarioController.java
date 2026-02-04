package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${upload.path.profiles}")
    private String uploadDir;

    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> listarUsuarios() {
        try {
            return ResponseEntity.ok(usuarioRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al obtener usuarios: " + e.getMessage());
        }
    }

    @GetMapping("/buscar")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> buscarPorNombre(@RequestParam("nombre") String nombre) {
        return ResponseEntity.ok(usuarioRepository.findByNombreContainingIgnoreCase(nombre));
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

        if (usuarioRepository.findByCorreo(correo).isPresent())
            return ResponseEntity.badRequest().body("Error: El correo ya existe.");

        Usuario u = new Usuario();
        u.setNombre(nombre);
        u.setApellido(apellido);
        u.setCorreo(correo);
        u.setPassword(passwordEncoder.encode(password));
        u.setRol(Usuario.Rol.valueOf(rol.toLowerCase()));

        // Guardado dinámico con conversión
        String folderName = Paths.get(uploadDir).getFileName().toString();
        u.setFoto_perfil((foto != null && !foto.isEmpty())
                ? guardarImagenWebP(foto)
                : "/" + folderName + "/default.png");

        usuarioRepository.save(u);
        return ResponseEntity.ok("Registrado con éxito.");
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

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // VALIDACIÓN DE CORREO ÚNICO
        if (correo != null && !correo.equalsIgnoreCase(usuario.getCorreo())) {
            Optional<Usuario> usuarioExistente = usuarioRepository.findByCorreo(correo);
            if (usuarioExistente.isPresent()) {
                return ResponseEntity.badRequest()
                        .body("Error: El correo " + correo + " ya está registrado por otro usuario.");
            }
            usuario.setCorreo(correo);
        }

        // Actualización de los demás campos...
        if (nombre != null)
            usuario.setNombre(nombre);
        if (apellido != null)
            usuario.setApellido(apellido);
        if (rol != null)
            usuario.setRol(Usuario.Rol.valueOf(rol.toLowerCase()));

        if (password != null && !password.isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(password));
        }

        if (foto != null && !foto.isEmpty()) {
            eliminarArchivoFisico(usuario.getFoto_perfil());
            usuario.setFoto_perfil(guardarImagenWebP(foto));
        }

        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario actualizado", "foto", usuario.getFoto_perfil()));
    }

    /**
     * Procesa la imagen, la convierte a WebP y la guarda en el disco.
     */
    private String guardarImagenWebP(MultipartFile foto) {
        try {
            // 1. Generar nombre único
            String nombreBase = System.currentTimeMillis() + "_perfil";
            String nombreArchivoWebp = nombreBase + ".webp";

            Path rutaPath = Paths.get(uploadDir).toAbsolutePath();
            if (!Files.exists(rutaPath))
                Files.createDirectories(rutaPath);

            // 2. Leer la imagen original
            BufferedImage imagenOriginal = ImageIO.read(foto.getInputStream());
            if (imagenOriginal == null) {
                throw new RuntimeException("El archivo subido no es una imagen válida.");
            }

            // 3. Preparar el archivo de destino
            File archivoDestino = rutaPath.resolve(nombreArchivoWebp).toFile();

            // 4. Convertir y escribir como WebP
            boolean escribio = ImageIO.write(imagenOriginal, "webp", archivoDestino);
            if (!escribio) {
                ImageIO.write(imagenOriginal, "png", archivoDestino);
            }

            String folderName = rutaPath.getFileName().toString();
            return "/" + folderName + "/" + nombreArchivoWebp;

        } catch (IOException e) {
            throw new RuntimeException("Error al procesar imagen WebP: " + e.getMessage());
        }
    }

    private void eliminarArchivoFisico(String rutaLogica) {
        if (rutaLogica == null || rutaLogica.toLowerCase().contains("default")) {
            System.out.println("Borrado cancelado: No se permite eliminar la imagen por defecto.");
            return;
        }

        try {
            String nombreArchivo = rutaLogica.substring(rutaLogica.lastIndexOf("/") + 1);
            Path rutaCompleta = Paths.get(uploadDir).toAbsolutePath().resolve(nombreArchivo);
            boolean eliminado = Files.deleteIfExists(rutaCompleta);

            if (eliminado) {
                System.out.println("Archivo eliminado físicamente: " + nombreArchivo);
            }
        } catch (IOException e) {
            System.err.println("Error al intentar eliminar archivo: " + e.getMessage());
        }
    }
}