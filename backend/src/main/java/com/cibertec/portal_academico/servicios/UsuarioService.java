package com.cibertec.portal_academico.servicios;

import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${upload.path.profiles}")
    private String uploadDir;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> buscarPorNombre(String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public Usuario obtenerPorId(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional
    public Usuario registrarUsuario(String nombre, String apellido, String correo, 
                                   String password, String rol, MultipartFile foto) {
        
        if (usuarioRepository.findByCorreo(correo).isPresent()) {
            throw new RuntimeException("El correo ya existe");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setCorreo(correo);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRol(Usuario.Rol.valueOf(rol.toLowerCase()));

        String folderName = Paths.get(uploadDir).getFileName().toString();
        usuario.setFoto_perfil((foto != null && !foto.isEmpty())
                ? guardarImagenWebP(foto)
                : "/" + folderName + "/default.webp");

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario editarUsuario(Integer id, String nombre, String apellido, 
                                String rol, String correo, String password, 
                                MultipartFile foto) {
        
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar correo único
        if (correo != null && !correo.equalsIgnoreCase(usuario.getCorreo())) {
            if (usuarioRepository.findByCorreo(correo).isPresent()) {
                throw new RuntimeException("El correo " + correo + " ya está registrado");
            }
            usuario.setCorreo(correo);
        }

        if (nombre != null) usuario.setNombre(nombre);
        if (apellido != null) usuario.setApellido(apellido);
        if (rol != null) usuario.setRol(Usuario.Rol.valueOf(rol.toLowerCase()));
        
        if (password != null && !password.isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(password));
        }

        if (foto != null && !foto.isEmpty()) {
            eliminarArchivoFisico(usuario.getFoto_perfil());
            usuario.setFoto_perfil(guardarImagenWebP(foto));
        }

        return usuarioRepository.save(usuario);
    }

    // --- PROCESAMIENTO DE IMÁGENES ---

    private String guardarImagenWebP(MultipartFile foto) {
        try {
            String nombreBase = System.currentTimeMillis() + "_perfil";
            String nombreArchivoWebp = nombreBase + ".webp";

            Path rutaPath = Paths.get(uploadDir).toAbsolutePath();
            if (!Files.exists(rutaPath)) Files.createDirectories(rutaPath);

            BufferedImage imagenOriginal = ImageIO.read(foto.getInputStream());
            if (imagenOriginal == null) {
                throw new RuntimeException("El archivo subido no es una imagen válida");
            }

            File archivoDestino = rutaPath.resolve(nombreArchivoWebp).toFile();

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
            return;
        }

        try {
            String nombreArchivo = rutaLogica.substring(rutaLogica.lastIndexOf("/") + 1);
            Path rutaCompleta = Paths.get(uploadDir).toAbsolutePath().resolve(nombreArchivo);
            Files.deleteIfExists(rutaCompleta);
        } catch (IOException e) {
            System.err.println("Error al intentar eliminar archivo: " + e.getMessage());
        }
    }
}