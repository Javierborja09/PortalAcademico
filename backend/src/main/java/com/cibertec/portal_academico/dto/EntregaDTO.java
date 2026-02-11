package com.cibertec.portal_academico.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EntregaDTO {
    private Integer idEntrega;
    private String nombreAlumno;
    private String apellidoAlumno;
    private String contenidoTexto;
    private String rutaArchivo;
    private BigDecimal nota;
    private String comentarioDocente;
    private LocalDateTime fechaEntrega;
    private Integer intentoNumero;
}