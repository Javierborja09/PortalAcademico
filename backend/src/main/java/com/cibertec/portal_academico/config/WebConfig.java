package com.cibertec.portal_academico.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${upload.path.profiles}")
    private String profileDir;

    @Value("${upload.path.courses}")
    private String courseDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Registro para Perfiles
        registrarRuta(registry, profileDir);
        // Registro para Cursos
        registrarRuta(registry, courseDir);
    }

    private void registrarRuta(ResourceHandlerRegistry registry, String dir) {
        Path pathObj = Paths.get(dir).toAbsolutePath();
        String folderName = pathObj.getFileName().toString();
        String resourceLocation = pathObj.toUri().toString();

        registry.addResourceHandler("/" + folderName + "/**")
                .addResourceLocations(resourceLocation);
                
        System.out.println("Mapeo: /" + folderName + "/** -> " + resourceLocation);
    }
}