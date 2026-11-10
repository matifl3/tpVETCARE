package com.example.PetCare.controller;

import com.example.PetCare.dto.LoginRequest;
import com.example.PetCare.dto.RegistroRequest;
import com.example.PetCare.enums.EstadoProfesional;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.UsuarioRepository;
import com.example.PetCare.security.JwtService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
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
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(PasswordEncoder passwordEncoder,
                          UsuarioRepository usuarioRepository,
                          ProfesionalRepository profesionalRepository,
                          AuthenticationManager authenticationManager,
                          JwtService jwtService) {
        this.passwordEncoder = passwordEncoder;
        this.usuarioRepository = usuarioRepository;
        this.profesionalRepository = profesionalRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    /**
     * Valida email y contraseña y, si son correctos, devuelve un token JWT
     * junto con los datos del usuario. El front guarda el token y lo manda
     * en cada request en el header "Authorization: Bearer <token>".
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();

        Map<String, Object> response = datosDeUsuario(usuario);
        response.put("mensaje", "Inicio de sesión exitoso");
        response.put("token", jwtService.generarToken(usuario.getEmail(), usuario.getRol().name()));
        return ResponseEntity.ok(response);
    }

    /** Devuelve los datos del usuario dueño del token. */
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        }
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName()).orElse(null);
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuario no encontrado"));
        }
        return ResponseEntity.ok(datosDeUsuario(usuario));
    }

    /** Datos del usuario que necesita el front (id, nombre, rol y si está aprobado). */
    private Map<String, Object> datosDeUsuario(Usuario usuario) {
        Map<String, Object> datos = new HashMap<>();
        datos.put("id", usuario.getIdUsuario());
        datos.put("nombre", usuario.getNombre());
        datos.put("email", usuario.getEmail());
        datos.put("rol", usuario.getRol().name());

        if (usuario.getRol() == Rol.ADMIN) {
            datos.put("pendientes", profesionalRepository.findByEstado(EstadoProfesional.PENDIENTE).size());
            datos.put("aprobado", true);
        } else if (usuario instanceof Profesional profesional) {
            datos.put("estado", profesional.getEstado().name());
            datos.put("aprobado", profesional.getEstado() == EstadoProfesional.APROBADO);
        } else {
            datos.put("aprobado", true);
        }
        return datos;
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
            // Si el rol es CLIENTE, crea un Usuario normal
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
