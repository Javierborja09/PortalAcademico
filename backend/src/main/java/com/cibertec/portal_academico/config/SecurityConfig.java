package com.cibertec.portal_academico.config;

import com.cibertec.portal_academico.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Recursos Estáticos (Imágenes)
                        .requestMatchers("/*/**.png", "/*/**.jpg", "/*/**.jpeg", "/*/**.webp").permitAll()

                        // 2. Autenticación
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/ws-portal/**").permitAll()
                        // 3. Cursos (Listar y ver detalles)
                        // Permitimos GET a cualquier usuario autenticado (alumno, docente, admin)
                        .requestMatchers(HttpMethod.GET, "/api/cursos/**").hasAnyAuthority("admin", "docente", "alumno")
                        // El registro y edición de cursos sí lo limitamos a admin
                        .requestMatchers(HttpMethod.POST, "/api/cursos/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.PUT, "/api/cursos/**").hasAuthority("admin")

                        // 4. Matrículas (Aula Virtual)
                        // Para ver integrantes y cursos del alumno
                        .requestMatchers(HttpMethod.GET, "/api/matriculas/**").authenticated()
                        // Para inscribir o retirar alumnos (solo admin)
                        .requestMatchers("/api/matriculas/registrar", "/api/matriculas/eliminar/**")
                        .hasAuthority("admin")

                        // 5. Usuarios y Horarios
                        .requestMatchers("/api/horarios/**").authenticated()
                        .requestMatchers("/api/usuarios/registrar").hasAuthority("admin")
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/editar/**").authenticated()

                        // 6. Anuncios
                        .requestMatchers(HttpMethod.GET, "/api/anuncios/curso/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/anuncios/crear").hasAuthority("docente")
                        .requestMatchers(HttpMethod.PUT, "/api/anuncios/**").hasAuthority("docente")
                        .requestMatchers(HttpMethod.DELETE, "/api/anuncios/**").hasAuthority("docente")

                        // Cualquier otra petición requiere login
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 1. ORIGEN ESPECÍFICO: No uses "*". Pon la URL de tu Vite.
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

        // 2. MÉTODOS PERMITIDOS
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 3. CABECERAS PERMITIDAS: Añadimos X-Requested-With que la usa SockJS
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));

        // 4. PERMITIR CREDENCIALES: Esto es lo que permite que el túnel de SockJS se
        // abra
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}