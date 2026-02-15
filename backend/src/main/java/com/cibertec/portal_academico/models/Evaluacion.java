package com.cibertec.portal_academico.models;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "evaluaciones")
public class Evaluacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_evaluacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_curso", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Curso curso;

    @Column(name = "titulo_evaluacion", nullable = false, length = 150)
    private String tituloEvaluacion;

    @Column(name = "descripcion_evaluacion", columnDefinition = "TEXT")
    private String descripcionEvaluacion;

    @Column(name = "ruta_recurso")
    private String rutaRecurso; 

    @Column(name = "fecha_limite", nullable = false)
    private LocalDateTime fechaLimite;

    @Column(name = "intentos_permitidos")
    private Integer intentosPermitidos = 1;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

}
