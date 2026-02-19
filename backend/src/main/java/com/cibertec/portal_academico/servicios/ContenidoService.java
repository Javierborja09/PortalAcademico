package com.cibertec.portal_academico.servicios;

import com.cibertec.portal_academico.models.Documento;
import com.cibertec.portal_academico.models.Tema;
import com.cibertec.portal_academico.models.Unidad;
import com.cibertec.portal_academico.repositorios.DocumentoRepository;
import com.cibertec.portal_academico.repositorios.TemaRepository;
import com.cibertec.portal_academico.repositorios.UnidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.io.IOException;
import java.nio.file.StandardCopyOption;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;

@Service
public class ContenidoService {

    @Autowired
    private UnidadRepository unidadRepo;

    @Autowired
    private TemaRepository temaRepo;

    @Autowired
    private DocumentoRepository documentoRepo;

    @Value("${upload.path.documents}")
    private String uploadDir;

    // Obtener todo el árbol de contenido (Unidades -> Temas)
    public List<Map<String, Object>> obtenerContenidoFull(Integer idCurso) {
        List<Unidad> unidades = unidadRepo.buscarPorCurso(idCurso);
        List<Map<String, Object>> respuesta = new ArrayList<>();

        for (Unidad u : unidades) {
            Map<String, Object> unidadDto = new HashMap<>();
            unidadDto.put("idUnidad", u.getId_unidad());
            unidadDto.put("tituloUnidad", u.getTituloUnidad());

            // Buscamos los temas de esta unidad
            List<Tema> temas = temaRepo.buscarPorUnidad(u.getId_unidad());
            List<Map<String, Object>> temasConDocs = new ArrayList<>();

            for (Tema t : temas) {
                Map<String, Object> temaDto = new HashMap<>();
                temaDto.put("id_tema", t.getId_tema());
                temaDto.put("tituloTema", t.getTituloTema());
                temaDto.put("descripcionTema", t.getDescripcionTema());
                temaDto.put("orden", t.getOrden());

                // Buscamos los documentos de este tema específico
                List<Documento> documentos = documentoRepo.buscarPorTema(t.getId_tema());
                temaDto.put("documentos", documentos);

                temasConDocs.add(temaDto);
            }

            unidadDto.put("temas", temasConDocs);
            respuesta.add(unidadDto);
        }
        return respuesta;
    }

    // CRUD UNIDADES
    public Unidad guardarUnidad(Unidad unidad) {
        if (unidad.getOrden() == null)
            unidad.setOrden(0);
        return unidadRepo.save(unidad);
    }

    public Unidad actualizarUnidad(Integer id, Unidad data) {
        Unidad unidad = unidadRepo.findById(id).orElseThrow();
        unidad.setTituloUnidad(data.getTituloUnidad());
        return unidadRepo.save(unidad);
    }

    public void eliminarUnidad(Integer id) {
        List<Tema> temas = temaRepo.buscarPorUnidad(id);

        for (Tema t : temas) {
            List<Documento> docs = documentoRepo.buscarPorTema(t.getId_tema());
            for (Documento d : docs) {
                eliminarArchivoFisico(d.getRutaArchivo());
            }
        }
        unidadRepo.deleteById(id);
    }

    // CRUD TEMAS
    public Tema guardarTema(Tema tema) {
        if (tema.getOrden() == null)
            tema.setOrden(0);
        return temaRepo.save(tema);
    }

    public Tema actualizarTema(Integer id, Tema data) {
        Tema tema = temaRepo.findById(id).orElseThrow();
        tema.setTituloTema(data.getTituloTema());
        tema.setDescripcionTema(data.getDescripcionTema());
        return temaRepo.save(tema);
    }

    public void eliminarTema(Integer id) {
        List<Documento> documentos = documentoRepo.buscarPorTema(id);

        for (Documento doc : documentos) {
            eliminarArchivoFisico(doc.getRutaArchivo());
        }
        temaRepo.deleteById(id);
    }

    @Transactional
    public Documento guardarDocumento(Integer idTema, String titulo, MultipartFile archivo) {
        Tema tema = temaRepo.findById(idTema)
                .orElseThrow(() -> new RuntimeException("Tema no encontrado"));

        Documento doc = new Documento();
        doc.setTema(tema);
        doc.setTituloDocumento(titulo);
        doc.setRutaArchivo(subirArchivoFisico(archivo));

        return documentoRepo.save(doc);
    }

    @Transactional
    public void eliminarDocumento(Integer id) {
        Documento doc = documentoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        eliminarArchivoFisico(doc.getRutaArchivo());
        documentoRepo.delete(doc);
    }

    // --- LÓGICA DE ARCHIVOS (SIMILAR A USUARIO) ---

    private String subirArchivoFisico(MultipartFile archivo) {
        try {
            if (archivo.isEmpty())
                throw new RuntimeException("Archivo vacío");

            // Crear nombre único: timestamp + nombre original para conservar extensión
            String nombreOriginal = archivo.getOriginalFilename();
            String nombreFinal = System.currentTimeMillis() + "_" + nombreOriginal.replaceAll("\\s+", "_");

            Path rutaPath = Paths.get(uploadDir).toAbsolutePath();
            if (!Files.exists(rutaPath))
                Files.createDirectories(rutaPath);

            Path destino = rutaPath.resolve(nombreFinal);
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            // Retorna ruta lógica para el frontend (ej: /documents/archivo.pdf)
            String folderName = rutaPath.getFileName().toString();
            return "/" + folderName + "/" + nombreFinal;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar archivo: " + e.getMessage());
        }
    }

    private void eliminarArchivoFisico(String rutaLogica) {
        try {
            String nombreArchivo = rutaLogica.substring(rutaLogica.lastIndexOf("/") + 1);
            Path rutaCompleta = Paths.get(uploadDir).toAbsolutePath().resolve(nombreArchivo);
            Files.deleteIfExists(rutaCompleta);
        } catch (IOException e) {
            System.err.println("Error al borrar archivo físico: " + e.getMessage());
        }
    }
}