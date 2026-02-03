package com.cibertec.portal_academico.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CursoDTO {
    private Integer id_curso;
    private String nombreCurso;
    private String codigoCurso;
    private Integer idDocente;
    private String nombreDocente; 
    private String imagenPortada;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}