package com.cibertec.portal_academico.dto;

import java.time.LocalDate;

import lombok.Data;

@Data // Si usas Lombok, sino genera Getters y Setters
public class AnuncioDTO {
    private Integer idCurso;
    private String titulo;
    private String contenido;
    private LocalDate fechaPublicacion;
}