package com.cibertec.portal_academico.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "entregas")
@Data
public class Entrega {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_entrega;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evaluacion")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Evaluacion evaluacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_alumno")
    private Usuario alumno;

    @Column(name = "contenido_texto", columnDefinition = "TEXT")
    private String contenidoTexto;

    @Column(name = "ruta_archivo")
    private String rutaArchivo;

    private BigDecimal nota;

    @Column(name = "comentario_docente", columnDefinition = "TEXT")
    private String comentarioDocente;

    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega = LocalDateTime.now();

    @Column(name = "intento_numero")
    private Integer intentoNumero = 1;
}