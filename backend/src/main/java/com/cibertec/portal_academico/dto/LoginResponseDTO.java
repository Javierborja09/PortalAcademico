package com.cibertec.portal_academico.dto;

public class LoginResponseDTO {
    private String token;
    private String nombre;
    private String apellido;
    private String rol;
    private Integer userId;
    private String foto;

    public LoginResponseDTO(String token, String nombre, String apellido, String rol, Integer userId, String foto) {
        this.token = token;
        this.nombre = nombre;
        this.apellido = apellido;
        this.rol = rol;
        this.userId = userId;
        this.foto = foto;
    }

    // Getters y Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }
}