package com.example.PetCare.controller;

import com.example.PetCare.dto.RegistroRequest;
import com.example.PetCare.enums.EstadoProfesional;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // Roles que corresponden a profesionales (tienen matrícula y experiencia)
    private static final Set<Rol> ROLES_PROFESIONALES = Set.of(
        Rol.VETERINARIO, Rol.PASEADOR, Rol.PELUQUERO, Rol.ADIESTRADOR, Rol.CUIDADOR
    );

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final PasswordEncoder passwordEncoder;
    private final UsuarioRepository usuarioRepository;
    private final ProfesionalRepository profesionalRepository;

    public AuthController(PasswordEncoder passwordEncoder,
                          UsuarioRepository usuarioRepository,
                          ProfesionalRepository profesionalRepository) {
        this.passwordEncoder = passwordEncoder;
        this.usuarioRepository = usuarioRepository;
        this.profesionalRepository = profesionalRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        }
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName()).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuario no encontrado"));
        }
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("nombre", usuario.getNombre());
        response.put("email", usuario.getEmail());
        response.put("rol", usuario.getRol().name());
        if (usuario.getRol() == Rol.ADMIN) {
            long pendientes = profesionalRepository.findByEstado(EstadoProfesional.PENDIENTE).size();
            response.put("pendientes", pendientes);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/registro")
    @Transactional
    public ResponseEntity<Map<String, String>> registrar(@RequestBody @Valid RegistroRequest request) {
        try {
            // No se permite auto-registro como ADMIN
            if (request.getRol() == Rol.ADMIN) {
                return ResponseEntity.badRequest().body(Map.of("error", "No se permite auto-registro como ADMIN"));
            }

            // Verifica si el email ya está registrado
            if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
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

            // Guarda el usuario en JPA con la contraseña hasheada
            // Si el rol es profesional, crea un Profesional (con matrícula y experiencia)
            // Si el rol es DUENIO, crea un Usuario normal
            if (esProfesional) {
                Profesional profesional = new Profesional();
                profesional.setNombre(request.getNombre());
                profesional.setApellido(request.getApellido());
                profesional.setEmail(request.getEmail());
                profesional.setTelefono(request.getTelefono());
                profesional.setPassword(hash);
                profesional.setRol(request.getRol());
                // Estado inicial: PENDIENTE. El admin debe aprobarlo antes de que pueda operar.
                // activo = false porque no puede ofrecer servicios hasta ser aprobado.
                profesional.setActivo(false);
                profesional.setEstado(EstadoProfesional.PENDIENTE);
                profesional.setMatricula(request.getMatricula());
                profesional.setExperiencia(request.getExperiencia());
                profesionalRepository.save(profesional);
            } else {
                Usuario usuario = new Usuario();
                usuario.setNombre(request.getNombre());
                usuario.setApellido(request.getApellido());
                usuario.setEmail(request.getEmail());
                usuario.setTelefono(request.getTelefono());
                usuario.setPassword(hash);
                usuario.setRol(request.getRol());
                usuario.setActivo(true);
                usuarioRepository.save(usuario);
            }

            return ResponseEntity.ok(Map.of("mensaje", "Usuario registrado exitosamente"));
        } catch (Exception e) {
            log.error("Error al registrar usuario: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Error interno del servidor: " + e.getMessage()));
        }
    }
}
