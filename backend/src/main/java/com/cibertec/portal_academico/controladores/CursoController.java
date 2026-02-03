package com.cibertec.portal_academico.controladores;

import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.CursoRepository;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 1. LISTAR TODO (Solo para Admin)
    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('admin')")
    public List<Curso> listarTodos() {
        return cursoRepository.findAll();
    }

    // 2. CREAR CURSO (Solo Admin)
    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('admin')") 
    public ResponseEntity<?> crearCurso(@RequestBody Curso curso, @RequestParam Integer idDocente) {
        Optional<Usuario> docenteOpt = usuarioRepository.findById(idDocente);
        
        if (docenteOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: El docente no existe.");
        }

        curso.setDocente(docenteOpt.get());
        return ResponseEntity.ok(cursoRepository.save(curso));
    }

    // 3. EDITAR CURSO (Solo Admin)
    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAuthority('admin')") 
    public ResponseEntity<?> editarCurso(@PathVariable Integer id, @RequestBody Curso cursoDetalles) {
        Optional<Curso> cursoOpt = cursoRepository.findById(id);

        if (cursoOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Error: El curso no existe.");
        }

        Curso curso = cursoOpt.get();
        curso.setNombreCurso(cursoDetalles.getNombreCurso());
        curso.setCodigoCurso(cursoDetalles.getCodigoCurso());
        curso.setFechaInicio(cursoDetalles.getFechaInicio());
        curso.setFechaFin(cursoDetalles.getFechaFin());
        
        return ResponseEntity.ok(cursoRepository.save(curso));
    }

    // 4. ELIMINAR CURSO (Solo Admin)
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('admin')") 
    public ResponseEntity<?> eliminarCurso(@PathVariable Integer id) {
        cursoRepository.deleteById(id);
        return ResponseEntity.ok("Curso eliminado");
    }

    // 5. CURSOS POR DOCENTE
    @GetMapping("/docente/{idDocente}")
    @PreAuthorize("hasAnyAuthority('docente', 'admin')") 
    public List<Curso> listarPorDocente(@PathVariable Integer idDocente) {
        return cursoRepository.findByDocenteId(idDocente);
    }

    // 6. CURSOS POR ALUMNO
    @GetMapping("/alumno/{idAlumno}")
    @PreAuthorize("hasAnyAuthority('alumno', 'admin')")
    public List<Curso> listarPorAlumno(@PathVariable Integer idAlumno) {
        return cursoRepository.findCursosByAlumnoId(idAlumno);
    }
}