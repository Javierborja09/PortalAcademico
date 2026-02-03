package com.cibertec.portal_academico.dto;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Integer id_usuario;
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;
    private String foto_perfil;
}