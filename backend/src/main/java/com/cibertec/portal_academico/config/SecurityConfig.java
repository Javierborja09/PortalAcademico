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
                .headers(headers -> headers
                        .frameOptions(frame -> frame.disable())
                        .addHeaderWriter((request, response) -> {
                            response.setHeader("X-Frame-Options", "ALLOW-FROM http://localhost:5173");
                        }))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Recursos Estáticos (Imágenes y Documentos)
                        .requestMatchers("/*/**.png", "/*/**.jpg", "/*/**.jpeg", "/*/**.webp", "/*/**.pdf").permitAll()
                        .requestMatchers("/documents/**").permitAll()
                        .requestMatchers("/submissions/**").permitAll()
                        .requestMatchers("/exams/**").permitAll()
                        
                       

                        // 2. Autenticación
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/ws-portal/**").permitAll()

                        // 3. Cursos
                        .requestMatchers(HttpMethod.GET, "/api/cursos/**").hasAnyAuthority("admin", "docente", "alumno")
                        .requestMatchers(HttpMethod.POST, "/api/cursos/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.PUT, "/api/cursos/**").hasAuthority("admin")

                        // 4. Matrículas
                        .requestMatchers(HttpMethod.GET, "/api/matriculas/**").authenticated()
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

                        // 7. Contenido (Unidades, Temas y Documentos)
                        .requestMatchers(HttpMethod.GET, "/api/contenido/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/contenido/**").hasAnyAuthority("docente", "admin")
                        .requestMatchers(HttpMethod.PUT, "/api/contenido/**").hasAnyAuthority("docente", "admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/contenido/**").hasAnyAuthority("docente", "admin")

                        // 8. EVALUACIONES 
                        .requestMatchers(HttpMethod.GET, "/api/evaluaciones/**").authenticated() // Alumnos ven la tarea
                        .requestMatchers(HttpMethod.POST, "/api/evaluaciones/**").hasAnyAuthority("docente", "admin")
                        .requestMatchers(HttpMethod.PUT, "/api/evaluaciones/**").hasAnyAuthority("docente", "admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/evaluaciones/**").hasAnyAuthority("docente", "admin")

                        // 9. ENTREGAS 
                        .requestMatchers(HttpMethod.POST, "/api/entregas/enviar").hasAuthority("alumno") 
                        .requestMatchers(HttpMethod.GET, "/api/entregas/evaluacion/*/mis-entregas/**").hasAuthority("alumno")
                        .requestMatchers(HttpMethod.GET, "/api/entregas/evaluacion/*/todas").hasAnyAuthority("docente", "admin")
                        .requestMatchers(HttpMethod.PUT, "/api/entregas/calificar/**").hasAnyAuthority("docente", "admin")

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
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        config.setExposedHeaders(Arrays.asList("X-Frame-Options"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}