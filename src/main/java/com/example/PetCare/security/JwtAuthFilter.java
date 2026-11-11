package com.example.PetCare.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que corre una vez por request, antes de los controllers.
 *
 * 1. Busca el header "Authorization: Bearer <token>".
 * 2. Si el token es válido, carga el usuario y lo pone en el SecurityContext.
 * 3. A partir de ahí, @PreAuthorize y AuthUtils saben quién es el usuario.
 *
 * Si no hay token (o es inválido) no hace nada: el request sigue como anónimo
 * y Spring Security responde 401 si el endpoint requiere autenticación.
 *
 * No es un bean (@Component/@Bean) a propósito: se crea dentro de
 * SecurityConfiguration para que corra solo en la cadena de Spring Security
 * y Spring Boot no lo registre además como filtro global.
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String PREFIJO = "Bearer ";

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith(PREFIJO)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            String email = jwtService.extraerEmail(header.substring(PREFIJO.length()));
            if (email != null) {
                autenticar(email, request);
            }
        }

        chain.doFilter(request, response);
    }

    private void autenticar(String email, HttpServletRequest request) {
        try {
            UserDetails user = userDetailsService.loadUserByUsername(email);
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (UsernameNotFoundException e) {
            // El usuario del token ya no existe: se sigue como anónimo.
        }
    }
}
