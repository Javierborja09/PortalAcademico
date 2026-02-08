package com.cibertec.portal_academico.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "unidades")
@Data
public class Unidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_unidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_curso", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Curso curso;

    @Column(name = "orden")
    private Integer orden = 0;

    @Column(name = "titulo_unidad", nullable = false, length = 150)
    private String tituloUnidad;

    @OneToMany(mappedBy = "unidad", cascade = CascadeType.ALL)
    private List<Tema> temas;
}