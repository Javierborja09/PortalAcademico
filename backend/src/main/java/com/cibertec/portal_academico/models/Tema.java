package com.cibertec.portal_academico.models;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "temas")
@Data
public class Tema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_tema;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_unidad", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Unidad unidad;

    @Column(name = "titulo_tema", nullable = false)
    private String tituloTema;

    @Column(name = "descripcion_tema")
    private String descripcionTema;

    private Integer orden = 0;
}