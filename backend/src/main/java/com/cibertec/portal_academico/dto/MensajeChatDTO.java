package com.cibertec.portal_academico.dto;

import lombok.Data;

@Data
public class MensajeChatDTO {
    private String contenido;
    private String remitente;
    private String tipo;     // "CHAT", "JOIN", "LEAVE", "START_SESSION", etc.
    private Integer cursoId;
    private String rol;    
    private String foto; 
}