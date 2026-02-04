package com.cibertec.portal_academico.dto;

import java.time.LocalTime;

import lombok.Data;

@Data
public class HorarioDTO {
    
    private Integer idHorario;
    private Integer idCurso;
    private String nombreCurso;
    private String diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String aula;
}
