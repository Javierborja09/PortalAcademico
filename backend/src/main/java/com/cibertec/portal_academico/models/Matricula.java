package com.cibertec.portal_academico.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "matriculas")
@Data
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_matricula;

    // Relación con el Alumno (Usuario)
    @ManyToOne
    @JoinColumn(name = "id_alumno")
    private Usuario alumno;

    // Relación con el Curso
    @ManyToOne
    @JoinColumn(name = "id_curso")
    private Curso curso;

    @Column(length = 10)
    private String ciclo;
}