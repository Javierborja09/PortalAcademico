package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.CursoRepository;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Value("${upload.path.courses}")
    private String uploadDir;

    // 1. LISTAR TODO (Solo para Admin)
    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('admin')")
    public List<Curso> listarTodos() {
        return cursoRepository.findAll();
    }

    // 2. CREAR CURSO
    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('admin')") 
    public ResponseEntity<?> crearCurso(
            @RequestParam("nombreCurso") String nombre,
            @RequestParam("codigoCurso") String codigo,
            @RequestParam("fechaInicio") String fechaInicio,
            @RequestParam("fechaFin") String fechaFin,
            @RequestParam("idDocente") Integer idDocente,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {

        Optional<Usuario> docenteOpt = usuarioRepository.findById(idDocente);
        if (docenteOpt.isEmpty()) return ResponseEntity.badRequest().body("Error: Docente no encontrado.");

        Curso curso = new Curso();
        curso.setNombreCurso(nombre);
        curso.setCodigoCurso(codigo);
        curso.setFechaInicio(LocalDate.parse(fechaInicio));
        curso.setFechaFin(LocalDate.parse(fechaFin));
        curso.setDocente(docenteOpt.get());

        // Manejo dinámico de carpetas
        String folderName = Paths.get(uploadDir).getFileName().toString();
        curso.setImagenPortada((imagen != null && !imagen.isEmpty())
                ? guardarImagenWebP(imagen)
                : "/" + folderName + "/default_course.png");

        cursoRepository.save(curso);
        
        // Respuesta estructurada para evitar errores de serialización en React
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Curso creado con éxito");
        respuesta.put("imagen", curso.getImagenPortada());
        return ResponseEntity.ok(respuesta);
    }

    // 3. EDITAR CURSO
    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAuthority('admin')") 
    public ResponseEntity<?> editarCurso(
            @PathVariable Integer id,
            @RequestParam(value = "nombreCurso", required = false) String nombre,
            @RequestParam(value = "codigoCurso", required = false) String codigo,
            @RequestParam(value = "fechaInicio", required = false) String fechaInicio,
            @RequestParam(value = "fechaFin", required = false) String fechaFin,
            @RequestParam(value = "idDocente", required = false) Integer idDocente,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {

        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        if (nombre != null) curso.setNombreCurso(nombre);
        if (codigo != null) curso.setCodigoCurso(codigo);
        if (fechaInicio != null) curso.setFechaInicio(LocalDate.parse(fechaInicio));
        if (fechaFin != null) curso.setFechaFin(LocalDate.parse(fechaFin));
        
        if (idDocente != null) {
            usuarioRepository.findById(idDocente).ifPresent(curso::setDocente);
        }

        // Actualización de imagen física y lógica
        if (imagen != null && !imagen.isEmpty()) {
            eliminarArchivoFisico(curso.getImagenPortada());
            curso.setImagenPortada(guardarImagenWebP(imagen));
        }

        cursoRepository.save(curso);

        // Devolvemos Map para asegurar que React reciba la nueva URL de imagen
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Curso actualizado correctamente");
        respuesta.put("imagen", curso.getImagenPortada());
        
        return ResponseEntity.ok(respuesta);
    }

    // 4. ELIMINAR CURSO
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('admin')") 
    public ResponseEntity<?> eliminarCurso(@PathVariable Integer id) {
        cursoRepository.findById(id).ifPresent(c -> {
            eliminarArchivoFisico(c.getImagenPortada());
            cursoRepository.deleteById(id);
        });
        return ResponseEntity.ok("Curso eliminado");
    }

    // 5. LISTADOS ESPECÍFICOS
    @GetMapping("/docente/{idDocente}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')") 
    public List<Curso> listarPorDocente(@PathVariable Integer idDocente) {
        return cursoRepository.findByDocenteId(idDocente);
    }

    @GetMapping("/alumno/{idAlumno}")
    @PreAuthorize("hasAnyAuthority('alumno', 'admin')")
    public List<Curso> listarPorAlumno(@PathVariable Integer idAlumno) {
        return cursoRepository.findCursosByAlumnoId(idAlumno);
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

    // 6. OBTENER CURSO POR ID 
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()") 
    public ResponseEntity<Curso> obtenerPorId(@PathVariable Integer id) {
        return cursoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}