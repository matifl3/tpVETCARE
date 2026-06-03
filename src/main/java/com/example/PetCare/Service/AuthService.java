package com.example.PetCare.Service;

import com.example.PetCare.model.RolUsuario;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Función para registrar un usuario común desde el formulario público.
    // Solo permite crear usuarios con rol USUARIO. Rechaza cualquier intento de registro
    // con roles profesionales (VETERINARIO, PASEADOR, etc.) o ADMINISTRADOR.
    // Verifica que el email no esté duplicado. La contraseña se guarda hasheada con BCrypt.
    // - Matias Z.
    public Usuario registrar(String nombre, String apellido, String email, String password, RolUsuario rol) {
        if (rol != RolUsuario.USUARIO) {
            throw new IllegalArgumentException("El registro público solo está disponible para usuarios. Los profesionales deben postularse.");
        }

        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("El email ya está registrado en  el sistema");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRol(rol);
        usuario.setActivo(true);

        return usuarioRepository.save(usuario);
    }

    /* Función para autenticar un usuario al iniciar sesión.*/
    // Busca al usuario por email, verifica que esté activo, que la contraseña
    // coincida y que el rol seleccionado en el formulario
    // sea exactamente el mismo que tiene asignado en la base de datos.
    // - Matias Z.
    public Usuario autenticar(String email, String password, RolUsuario rol) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email no registrado"));

        if (!usuario.isActivo()) {
            throw new IllegalArgumentException("Usuario desactivado");
        }

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new IllegalArgumentException("Contraseña incorrecta. Intente nuevamente");
        }

        if (usuario.getRol() != rol) {
            throw new IllegalArgumentException("El rol seleccionado no coincide");
        }

        return usuario;
    }
}
