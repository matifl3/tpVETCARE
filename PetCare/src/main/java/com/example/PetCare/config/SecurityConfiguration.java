package com.example.PetCare.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import javax.sql.DataSource;

// @Configuration — Le dice a Spring que esta clase define beans (objetos que Spring maneja y inyecta donde se necesiten).
// @EnableWebSecurity — Activa la configuración de seguridad web de Spring Security.
// @EnableMethodSecurity — Activa las anotaciones @PreAuthorize y @PostAuthorize en los controllers y services.
// Sin esta anotación, todas las anotaciones @PreAuthorize("hasRole('ADMIN')") se ignoran silenciosamente.
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

    //- users(DataSource) — Crea un JdbcUserDetailsManager que usa la conexión a la base de datos (DataSource) para buscar usuarios en las tablas users y authorities.
    // Spring Security ya sabe hacer las queries a esas tablas sin que las escribamos.
    @Bean
    public UserDetailsManager users(DataSource dataSource) {
        return new JdbcUserDetailsManager(dataSource);
    }

    //- passwordEncoder() — Crea un codificador de contraseñas que usa el prefijo automático.
    // Cuando guardas una contraseña con {bcrypt}..., al hacer login Spring compara usando el mismo algoritmo. {noop} significa sin codificar (solo para pruebas).
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login", "/css/**", "/js/**", "/img/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/registro").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .permitAll()
            )
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }

    /**
     * Configuración CORS: define qué orígenes, métodos HTTP y headers están permitidos.
     * En producción, reemplizá "*" por los dominios específicos de tu frontend.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Permitir todos los orígenes en desarrollo. En producción, especificá dominios concretos.
        config.setAllowedOrigins(List.of("*"));
        // Métodos HTTP que el frontend puede usar
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Headers que el frontend puede enviar (incluye Authorization para Basic Auth)
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}