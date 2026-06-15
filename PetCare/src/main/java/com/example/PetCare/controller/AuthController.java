package com.example.PetCare.controller;

import com.example.PetCare.dto.RegistroRequest;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Roles que corresponden a profesionales (tienen matrícula y experiencia)
    private static final Set<Rol> ROLES_PROFESIONALES = Set.of(
        Rol.VETERINARIO, Rol.PASEADOR, Rol.PELUQUERO, Rol.ADIESTRADOR, Rol.CUIDADOR
    );

    private final UserDetailsManager userDetailsManager;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioRepository usuarioRepository;
    private final ProfesionalRepository profesionalRepository;

    public AuthController(UserDetailsManager userDetailsManager,
                          PasswordEncoder passwordEncoder,
                          UsuarioRepository usuarioRepository,
                          ProfesionalRepository profesionalRepository) {
        this.userDetailsManager = userDetailsManager;
        this.passwordEncoder = passwordEncoder;
        this.usuarioRepository = usuarioRepository;
        this.profesionalRepository = profesionalRepository;
    }

    @PostMapping("/registro")
    @Transactional
    public ResponseEntity<Map<String, String>> registrar(@RequestBody @Valid RegistroRequest request) {
        // No se permite auto-registro como ADMIN
        if (request.getRol() == Rol.ADMIN) {
            return ResponseEntity.badRequest().body(Map.of("error", "No se permite auto-registro como ADMIN"));
        }

        // Verifica si el email ya está registrado
        if (userDetailsManager.userExists(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "El email ya está registrado"));
        }

        // Validar que los profesionales envíen matrícula y experiencia
        boolean esProfesional = ROLES_PROFESIONALES.contains(request.getRol());
        if (esProfesional) {
            if (request.getMatricula() == null || request.getMatricula().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Los profesionales deben enviar matrícula"));
            }
            if (request.getExperiencia() == null || request.getExperiencia().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Los profesionales deben enviar experiencia"));
            }
        }

        // Hashea la contraseña con prefijo {bcrypt}
        String hash = passwordEncoder.encode(request.getPassword());

        // Guarda en las tablas users y authorities de Spring Security
        userDetailsManager.createUser(
            User.builder()
                .username(request.getEmail())
                .password(hash)
                .roles(request.getRol().name())
                .build()
        );

        // Guarda los datos del negocio en la tabla de JPA
        // Si el rol es profesional, crea un Profesional (con matrícula y experiencia)
        // Si el rol es DUENIO, crea un Usuario normal
        if (esProfesional) {
            Profesional profesional = new Profesional();
            profesional.setNombre(request.getNombre());
            profesional.setApellido(request.getApellido());
            profesional.setEmail(request.getEmail());
            profesional.setTelefono(request.getTelefono());
            profesional.setRol(request.getRol());
            profesional.setActivo(true);
            profesional.setMatricula(request.getMatricula());
            profesional.setExperiencia(request.getExperiencia());
            profesionalRepository.save(profesional);
        } else {
            Usuario usuario = new Usuario();
            usuario.setNombre(request.getNombre());
            usuario.setApellido(request.getApellido());
            usuario.setEmail(request.getEmail());
            usuario.setTelefono(request.getTelefono());
            usuario.setRol(request.getRol());
            usuario.setActivo(true);
            usuarioRepository.save(usuario);
        }

        return ResponseEntity.ok(Map.of("mensaje", "Usuario registrado exitosamente"));
    }
}
