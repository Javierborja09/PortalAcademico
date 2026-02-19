package com.cibertec.portal_academico.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "usuarios")
@Data 
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_usuario;

    private String nombre;
    private String apellido;

    @Column(unique = true)
    private String correo;

    private String password; 

    @Enumerated(EnumType.STRING)
    private Rol rol;

    private String foto_perfil;

    public enum Rol {
        alumno, docente, admin
    }
}