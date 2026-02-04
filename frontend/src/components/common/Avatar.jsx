import React from 'react';

const API_BASE = "http://localhost:8080";

const Avatar = ({ src, className = "w-10 h-10", type = "perfil", alt = "Imagen" }) => {
    const config = {
        perfil: "/profiles/default.webp",
        curso: "/courses/default.webp"
    };

    const defaultImg = `${API_BASE}${config[type] || config.perfil}`;
    
    // Función de limpieza de URL
    const getFinalSrc = () => {
        // Si no hay nada, devolvemos el default inmediatamente
        if (!src || src === "null" || src === "") return defaultImg;

        const srcStr = src.toString();

        // Si es una URL de memoria (Blob) o ya tiene el dominio, se usa tal cual
        if (srcStr.startsWith('blob:') || srcStr.startsWith('http')) {
            return srcStr;
        }

        // Si es una ruta relativa, aseguramos que empiece con / y concatenamos
        const path = srcStr.startsWith('/') ? srcStr : `/${srcStr}`;
        return `${API_BASE}${path}`;
    };

    return (
        <img 
            src={getFinalSrc()}
            alt={alt}
            // Importante: aspect-square asegura que no se deforme mientras carga
            className={`object-cover aspect-square border-2 border-white shadow-sm transition-transform duration-300 ${className}`}
            onError={(e) => {
                if (e.target.src !== defaultImg) {
                    e.target.src = defaultImg;
                }
            }}
        />
    );
};

export default Avatar;