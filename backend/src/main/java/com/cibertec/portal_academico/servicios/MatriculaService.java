package com.cibertec.portal_academico.servicios;

import com.cibertec.portal_academico.models.Curso;
import com.cibertec.portal_academico.models.Matricula;
import com.cibertec.portal_academico.models.Usuario;
import com.cibertec.portal_academico.repositorios.CursoRepository;
import com.cibertec.portal_academico.repositorios.MatriculaRepository;
import com.cibertec.portal_academico.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatriculaService {

    @Autowired
    private MatriculaRepository matriculaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    public List<Curso> listarCursosPorAlumno(Integer idAlumno) {
        List<Matricula> matriculas = matriculaRepository.findByAlumnoId(idAlumno);
        
        return matriculas.stream()
                .map(Matricula::getCurso)
                .collect(Collectors.toList());
    }

    @Transactional
    public Matricula matricularAlumno(Integer idAlumno, Integer idCurso, String ciclo) {
        Usuario alumno = usuarioRepository.findById(idAlumno)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        Curso curso = cursoRepository.findById(idCurso)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));

        Matricula nuevaMatricula = new Matricula();
        nuevaMatricula.setAlumno(alumno);
        nuevaMatricula.setCurso(curso);
        nuevaMatricula.setCiclo(ciclo != null ? ciclo : "2026-I");

        return matriculaRepository.save(nuevaMatricula);
    }

    @Transactional
    public void eliminarMatricula(Integer id) {
        if (!matriculaRepository.existsById(id)) {
            throw new RuntimeException("Registro de matrícula no encontrado");
        }
        matriculaRepository.deleteById(id);
    }

    public List<Matricula> listarMatriculasPorCurso(Integer idCurso) {
        return matriculaRepository.findByCursoId(idCurso);
    }
}