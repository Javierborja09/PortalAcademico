package com.cibertec.portal_academico.servicios;

import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Horario;
import com.cibertec.portal_academico.repositorios.CursoRepository;
import com.cibertec.portal_academico.repositorios.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HorarioService {

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    public List<Horario> listarPorCurso(Integer idCurso) {
        return horarioRepository.findByCursoId(idCurso);
    }

    public List<Horario> listarTodos() {
        return horarioRepository.findAll();
    }

    @Transactional
    public Horario agregarHorario(Horario horario, Integer idCurso) {
        Curso curso = cursoRepository.findById(idCurso)
                .orElseThrow(() -> new RuntimeException("El curso no existe"));

        horario.setCurso(curso);
        return horarioRepository.save(horario);
    }

    @Transactional
    public Horario editarHorario(Integer id, Horario detalles) {
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));

        horario.setDiaSemana(detalles.getDiaSemana());
        horario.setHoraInicio(detalles.getHoraInicio());
        horario.setHoraFin(detalles.getHoraFin());
        horario.setAula(detalles.getAula());

        return horarioRepository.save(horario);
    }

    @Transactional
    public void eliminarHorario(Integer id) {
        if (!horarioRepository.existsById(id)) {
            throw new RuntimeException("Horario no encontrado");
        }
        horarioRepository.deleteById(id);
    }
}