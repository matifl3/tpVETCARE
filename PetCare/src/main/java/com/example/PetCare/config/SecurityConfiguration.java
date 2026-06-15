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

    //- filterChain() — Configura las reglas de acceso:
    //- csrf().disable() — Deshabilita CSRF porque es una API REST (no usa formularios HTML).
    //- requestMatchers(HttpMethod.POST, "/api/auth/registro").permitAll() — El endpoint de registro es público, cualquiera puede crear usuario.
    //- anyRequest().authenticated() — Todo lo demás requiere estar autenticado.
    //- httpBasic() — Usa Basic Auth para autenticar (username + password en el header).

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/registro").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}