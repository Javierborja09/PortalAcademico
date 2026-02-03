package com.cibertec.portal_academico.controladores;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cibertec.portal_academico.dto.HorarioDTO;
import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Horario;
import com.cibertec.portal_academico.repositorios.CursoRepository;
import com.cibertec.portal_academico.repositorios.HorarioRepository;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {


    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    // 1. LISTAR TODOS LOS HORARIOS
    @GetMapping("/listar")
    @PreAuthorize("hasAuthority('admin')")
    public List<HorarioDTO> listarTodos() {
        List<Horario> horarios = horarioRepository.findAll();
        return horarios.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // 2. CREAR HORARIO (Solo Admin)
    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> crearHorario(@RequestBody HorarioDTO horarioDTO, @RequestParam Integer idCurso) {
        Optional<Curso> cursoOpt = cursoRepository.findById(idCurso);

        if (cursoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: El curso no existe.");
        }

        Horario horario = new Horario();
        horario.setCurso(cursoOpt.get());
        horario.setDiaSemana(Horario.Dias.valueOf(horarioDTO.getDiaSemana()));
        horario.setHoraInicio(horarioDTO.getHoraInicio());
        horario.setHoraFin(horarioDTO.getHoraFin());
        horario.setAula(horarioDTO.getAula());

        return ResponseEntity.ok(convertirADTO(horarioRepository.save(horario)));
    }

    // 3. EDITAR HORARIO (Solo Admin)
    @PutMapping("/editar/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> editarHorario(@PathVariable Integer id, @RequestBody HorarioDTO horarioDTO) {
        Optional<Horario> horarioOpt = horarioRepository.findById(id);

        if (horarioOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Error: El horario no existe.");
        }

        Horario horario = horarioOpt.get();
        horario.setDiaSemana(Horario.Dias.valueOf(horarioDTO.getDiaSemana()));
        horario.setHoraInicio(horarioDTO.getHoraInicio());
        horario.setHoraFin(horarioDTO.getHoraFin());
        horario.setAula(horarioDTO.getAula());

        return ResponseEntity.ok(convertirADTO(horarioRepository.save(horario)));
    }

    // 4. ELIMINAR HORARIO (Solo Admin)
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> eliminarHorario(@PathVariable Integer id) {
        Optional<Horario> horarioOpt = horarioRepository.findById(id);

        if (horarioOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Error: El horario no existe.");
        }

        horarioRepository.deleteById(id);
        return ResponseEntity.ok("Horario eliminado");
    }

    // 5. HORARIOS POR CURSO
    @GetMapping("/curso/{idCurso}")
    @PreAuthorize("hasAnyAuthority('alumno', 'docente', 'admin')")
    public List<HorarioDTO> listarPorCurso(@PathVariable Integer idCurso) {
        List<Horario> horarios = horarioRepository.findByCursoId(idCurso);
        return horarios.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // MÉTODO PARA CONVERTIR ENTIDAD A DTO
    private HorarioDTO convertirADTO(Horario horario) {
        HorarioDTO dto = new HorarioDTO();
        dto.setNombreCurso(horario.getCurso().getNombreCurso());
        dto.setDiaSemana(horario.getDiaSemana().name());
        dto.setHoraInicio(horario.getHoraInicio());
        dto.setHoraFin(horario.getHoraFin());
        dto.setAula(horario.getAula());
        return dto;
    }
}
