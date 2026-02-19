package com.cibertec.portal_academico.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "cursos")
@Data
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_curso;

    @Column(name = "nombre_curso", nullable = false, length = 100)
    private String nombreCurso;

    @Column(name = "codigo_curso", unique = true, length = 20)
    private String codigoCurso;

    @ManyToOne
    @JoinColumn(name = "id_docente")
    private Usuario docente;

    @Column(name = "imagen_portada")
    private String imagenPortada = "uploads/courses/default_course.png";

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;
}