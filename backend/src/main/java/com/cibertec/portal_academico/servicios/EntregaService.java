package com.cibertec.portal_academico.servicios;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cibertec.portal_academico.dto.EntregaDTO;
import com.cibertec.portal_academico.models.Entrega;
import com.cibertec.portal_academico.models.Evaluacion;
import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.EntregaRepository;
import com.cibertec.portal_academico.repositorios.EvaluacionRepository;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;

@Service
public class EntregaService {

    @Autowired
    private EntregaRepository entregaRepo;
    @Autowired
    private EvaluacionRepository evaluacionRepo;
    @Autowired
    private UsuarioRepository usuarioRepo;

    @Value("${upload.path.submissions}")
    private String uploadDir;

    // EL DOCENTE: Ve todas las entregas de una evaluación específica
    public List<EntregaDTO> obtenerEntregasPorEvaluacion(Integer idEval) {
        return entregaRepo.buscarPorEvaluacion(idEval).stream()
                .map(e -> new EntregaDTO(
                        e.getId_entrega(),
                        e.getAlumno().getNombre(),
                        e.getAlumno().getApellido(),
                        e.getContenidoTexto(),
                        e.getRutaArchivo(),
                        e.getNota(),
                        e.getComentarioDocente(),
                        e.getFechaEntrega(),
                        e.getIntentoNumero()))
                .collect(Collectors.toList());
    }

    // EL ALUMNO: Ve solo sus entregas para una evaluación específica
    public List<EntregaDTO> obtenerMisEntregas(Integer idEval, Integer idAlumno) {
       return entregaRepo.buscarPorEvaluacionYAlumno(idEval, idAlumno).stream()
            .map(e -> new EntregaDTO(
                    e.getId_entrega(),
                    e.getAlumno().getNombre(),
                    e.getAlumno().getApellido(),
                    e.getContenidoTexto(),
                    e.getRutaArchivo(),
                    e.getNota(),
                    e.getComentarioDocente(),
                    e.getFechaEntrega(),
                    e.getIntentoNumero()))
            .collect(Collectors.toList());
    }

    @Transactional
    public Entrega realizarEntrega(Integer idEval, Integer idAlumno, String texto, MultipartFile archivo) {
        Evaluacion eval = evaluacionRepo.findById(idEval).orElseThrow();
        Usuario alumno = usuarioRepo.findById(idAlumno).orElseThrow();

        // 1. Validar Fecha Límite
        if (LocalDateTime.now().isAfter(eval.getFechaLimite())) {
            throw new RuntimeException("El tiempo de entrega ha finalizado.");
        }

        // 2. Manejar Intentos
        List<Entrega> entregasPrevias = entregaRepo.buscarPorEvaluacionYAlumno(idEval, idAlumno);
        int siguienteIntento = entregasPrevias.isEmpty() ? 1 : entregasPrevias.get(0).getIntentoNumero() + 1;

        if (siguienteIntento > eval.getIntentosPermitidos()) {
            throw new RuntimeException(
                    "Has alcanzado el límite de intentos permitidos (" + eval.getIntentosPermitidos() + ").");
        }

        // 3. Crear Entrega
        Entrega entrega = new Entrega();
        entrega.setEvaluacion(eval);
        entrega.setAlumno(alumno);
        entrega.setContenidoTexto(texto);
        entrega.setIntentoNumero(siguienteIntento);

        if (archivo != null && !archivo.isEmpty()) {
            entrega.setRutaArchivo(guardarArchivoFisico(archivo));
        }

        return entregaRepo.save(entrega);
    }

    // Método para que el docente califique
    @Transactional
    public Entrega calificarEntrega(Integer idEntrega, BigDecimal nota, String comentario) {
        Entrega entrega = entregaRepo.findById(idEntrega).orElseThrow();
        entrega.setNota(nota);
        entrega.setComentarioDocente(comentario);
        return entregaRepo.save(entrega);
    }

    private String guardarArchivoFisico(MultipartFile archivo) {
        try {
            String nombreFinal = System.currentTimeMillis() + "_"
                    + archivo.getOriginalFilename().replaceAll("\\s+", "_");
            Path rutaPath = Paths.get(uploadDir).toAbsolutePath();
            if (!Files.exists(rutaPath))
                Files.createDirectories(rutaPath);
            Files.copy(archivo.getInputStream(), rutaPath.resolve(nombreFinal), StandardCopyOption.REPLACE_EXISTING);

            return "/" + nombreFinal;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo del alumno");
        }
    }
}