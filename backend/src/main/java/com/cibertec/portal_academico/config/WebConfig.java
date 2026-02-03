package com.cibertec.portal_academico.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${upload.path}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path pathObj = Paths.get(uploadDir).toAbsolutePath();
        
        String folderName = pathObj.getFileName().toString();
        
        String resourceLocation = pathObj.toUri().toString();

        registry.addResourceHandler("/" + folderName + "/**")
                .addResourceLocations(resourceLocation);
                
        System.out.println("Mapeo dinámico establecido: /" + folderName + "/** -> " + resourceLocation);
    }
}