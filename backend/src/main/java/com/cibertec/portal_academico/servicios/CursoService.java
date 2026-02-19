package com.cibertec.portal_academico.servicios;

import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.CursoRepository;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.List;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Value("${upload.path.courses}")
    private String uploadDir;

    public List<Curso> listarTodos() {
        return cursoRepository.findAll();
    }

    public List<Curso> listarPorDocente(Integer idDocente) {
        return cursoRepository.findByDocenteId(idDocente);
    }

    public List<Curso> listarPorAlumno(Integer idAlumno) {
        return cursoRepository.findCursosByAlumnoId(idAlumno);
    }

    public Curso obtenerPorId(Integer id) {
        return cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
    }

    public boolean tieneAcceso(Integer idCurso, String email, String rol) {
        if (rol.equalsIgnoreCase("admin")) {
            return true;
        } else if (rol.equalsIgnoreCase("docente")) {
            return cursoRepository.existsByCursoIdAndDocenteEmail(idCurso, email);
        } else if (rol.equalsIgnoreCase("alumno")) {
            return cursoRepository.existsByCursoIdAndAlumnoEmail(idCurso, email);
        }
        return false;
    }

    @Transactional
    public Curso crearCurso(String nombre, String codigo, String fechaInicio, 
                           String fechaFin, Integer idDocente, MultipartFile imagen) {
        
        Usuario docente = usuarioRepository.findById(idDocente)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));

        Curso curso = new Curso();
        curso.setNombreCurso(nombre);
        curso.setCodigoCurso(codigo);
        curso.setFechaInicio(LocalDate.parse(fechaInicio));
        curso.setFechaFin(LocalDate.parse(fechaFin));
        curso.setDocente(docente);

        String folderName = Paths.get(uploadDir).getFileName().toString();
        curso.setImagenPortada((imagen != null && !imagen.isEmpty())
                ? guardarImagenWebP(imagen)
                : "/" + folderName + "/default.webp");

        return cursoRepository.save(curso);
    }

    @Transactional
    public Curso editarCurso(Integer id, String nombre, String codigo, 
                            String fechaInicio, String fechaFin, 
                            Integer idDocente, MultipartFile imagen) {
        
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        if (nombre != null) curso.setNombreCurso(nombre);
        if (codigo != null) curso.setCodigoCurso(codigo);
        if (fechaInicio != null) curso.setFechaInicio(LocalDate.parse(fechaInicio));
        if (fechaFin != null) curso.setFechaFin(LocalDate.parse(fechaFin));
        
        if (idDocente != null) {
            Usuario docente = usuarioRepository.findById(idDocente)
                    .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
            curso.setDocente(docente);
        }

        if (imagen != null && !imagen.isEmpty()) {
            eliminarArchivoFisico(curso.getImagenPortada());
            curso.setImagenPortada(guardarImagenWebP(imagen));
        }

        return cursoRepository.save(curso);
    }

    @Transactional
    public void eliminarCurso(Integer id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
        
        eliminarArchivoFisico(curso.getImagenPortada());
        cursoRepository.deleteById(id);
    }

    // --- PROCESAMIENTO DE IMÁGENES ---

    private String guardarImagenWebP(MultipartFile foto) {
        try {
            String nombreArchivoWebp = System.currentTimeMillis() + "_curso.webp";
            Path rutaPath = Paths.get(uploadDir).toAbsolutePath();
            
            if (!Files.exists(rutaPath)) Files.createDirectories(rutaPath);

            BufferedImage imagenOriginal = ImageIO.read(foto.getInputStream());
            File archivoDestino = rutaPath.resolve(nombreArchivoWebp).toFile();

            if (!ImageIO.write(imagenOriginal, "webp", archivoDestino)) {
                ImageIO.write(imagenOriginal, "png", archivoDestino);
            }

            return "/" + rutaPath.getFileName().toString() + "/" + nombreArchivoWebp;
        } catch (IOException e) {
            throw new RuntimeException("Error al procesar portada: " + e.getMessage());
        }
    }

    private void eliminarArchivoFisico(String rutaLogica) {
        if (rutaLogica == null || rutaLogica.toLowerCase().contains("default")) return;
        try {
            String nombreArchivo = rutaLogica.substring(rutaLogica.lastIndexOf("/") + 1);
            Path rutaCompleta = Paths.get(uploadDir).toAbsolutePath().resolve(nombreArchivo);
            Files.deleteIfExists(rutaCompleta);
        } catch (IOException e) {
            System.err.println("Error al borrar archivo: " + e.getMessage());
        }
    }
}
