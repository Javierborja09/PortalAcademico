package com.cibertec.portal_academico.servicios;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Evaluacion;
import com.cibertec.portal_academico.repositorios.CursoRepository;
import com.cibertec.portal_academico.repositorios.EvaluacionRepository;

@Service
public class EvaluacionService {
    @Autowired
    private EvaluacionRepository evaluacionRepo;

    @Autowired
    private CursoRepository cursoRepo;

    @Value("${upload.path.exams}")
    private String uploadDir;

    public List<Evaluacion> listarPorCurso(Integer idCurso) {
        return evaluacionRepo.findByCursoId(idCurso);
    }

    @Transactional
    public Evaluacion crearEvaluacion(Integer idCurso, String titulo, String descripcion,
            String fechaLimite, Integer intentos, MultipartFile archivo) {

        Curso curso = cursoRepo.findById(idCurso)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        Evaluacion eval = new Evaluacion();
        eval.setCurso(curso);
        eval.setTituloEvaluacion(titulo);
        eval.setDescripcionEvaluacion(descripcion);
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        eval.setFechaLimite(LocalDateTime.parse(fechaLimite, formatter));
        eval.setIntentosPermitidos(intentos);

        if (archivo != null && !archivo.isEmpty()) {
            eval.setRutaRecurso(subirArchivoFisico(archivo));
        }

        return evaluacionRepo.save(eval);
    }

    @Transactional
    public Evaluacion editarEvaluacion(Integer id, String titulo, String descripcion,
            String fechaLimite, Integer intentos, MultipartFile archivo) {

        // 1. Buscar la evaluación existente
        Evaluacion eval = evaluacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluación no encontrada"));

        // 2. Actualizar campos de texto solo si no son nulos
        if (titulo != null)
            eval.setTituloEvaluacion(titulo);
        if (descripcion != null)
            eval.setDescripcionEvaluacion(descripcion);
        if (fechaLimite != null)
            eval.setFechaLimite(LocalDateTime.parse(fechaLimite));
        if (intentos != null)
            eval.setIntentosPermitidos(intentos);

        // 3. Manejo del archivo (si el docente sube uno nuevo)
        if (archivo != null && !archivo.isEmpty()) {
            // Borrar el archivo anterior del disco si existe
            if (eval.getRutaRecurso() != null) {
                eliminarArchivoFisico(eval.getRutaRecurso());
            }
            // Subir el nuevo y actualizar la ruta en la BD
            eval.setRutaRecurso(subirArchivoFisico(archivo));
        }

        return evaluacionRepo.save(eval);
    }

    @Transactional
    public void eliminarEvaluacion(Integer id) {
        Evaluacion eval = evaluacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluación no encontrada"));

        if (eval.getRutaRecurso() != null) {
            eliminarArchivoFisico(eval.getRutaRecurso());
        }
        evaluacionRepo.delete(eval);
    }

    // --- LÓGICA DE ARCHIVOS (Mantiene tu estándar) ---

    private String subirArchivoFisico(MultipartFile archivo) {
        try {
             if (archivo.isEmpty())
                throw new RuntimeException("Archivo vacío");

            String nombreOriginal = archivo.getOriginalFilename();
            String nombreFinal = System.currentTimeMillis() + "_" + nombreOriginal.replaceAll("\\s+", "_");
            Path rutaPath = Paths.get(uploadDir).toAbsolutePath();

            if (!Files.exists(rutaPath))
                Files.createDirectories(rutaPath);

            Path destino = rutaPath.resolve(nombreFinal);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            return "/" + rutaPath.getFileName().toString() + "/" + nombreFinal;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo de evaluación: " + e.getMessage());
        }
    }

    private void eliminarArchivoFisico(String rutaLogica) {
        try {
            String nombreArchivo = rutaLogica.substring(rutaLogica.lastIndexOf("/") + 1);
            Path rutaCompleta = Paths.get(uploadDir).toAbsolutePath().resolve(nombreArchivo);
            Files.deleteIfExists(rutaCompleta);
        } catch (IOException e) {
            System.err.println("Error al borrar archivo de evaluación: " + e.getMessage());
        }
    }
}
