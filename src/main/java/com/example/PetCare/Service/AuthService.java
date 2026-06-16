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

    /*
     * Registra un usuario común desde el formulario público.
     * Solo permite rol USUARIO. Los profesionales deben pasar por el
     * proceso de postulación y aprobación.
     * Verifica email duplicado y hashea la contraseña con BCrypt.
     */
    public Usuario registrar(String nombre, String apellido, String email, String password, RolUsuario rol) {
        if (rol != RolUsuario.USUARIO) {
            throw new IllegalArgumentException("El registro público solo está disponible para usuarios. Los profesionales deben postularse.");
        }

        // Verifica que el email no esté ya registrado
        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("El email ya está registrado en el sistema");
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

    /*
     * Autentica un usuario al iniciar sesión.
     * Verifica: email existente, usuario activo, contraseña correcta,
     * y que el rol seleccionado coincida con el asignado en BD.
     */
    public Usuario autenticar(String email, String password, RolUsuario rol) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email no registrado"));

        // Verifica que la cuenta esté activa
        if (!usuario.isActivo()) {
            throw new IllegalArgumentException("Usuario desactivado");
        }

        // Verifica la contraseña contra el hash BCrypt
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new IllegalArgumentException("Contraseña incorrecta. Intente nuevamente");
        }

        // Verifica que el rol seleccionado coincida
        if (usuario.getRol() != rol) {
            throw new IllegalArgumentException("El rol seleccionado no coincide");
        }

        return usuario;
    }

    /*
     * Crea un usuario profesional cuando el admin/ dueño aprueba una postulación.
     * Asigna contraseña default (PetCare123) y marca debeCambiarPassword=true
     * para forzar el cambio en el primer inicio de sesión.
     */
    public Usuario crearUsuarioProfesional(String nombre, String apellido, String email, RolUsuario rol) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("El email ya está registrado en el sistema");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode("PetCare123"));
        usuario.setRol(rol);
        usuario.setActivo(true);
        usuario.setDebeCambiarPassword(true);

        return usuarioRepository.save(usuario);
    }

    /*
     * Cambia la contraseña de un usuario y desactiva debeCambiarPassword.
     * Se usa cuando un profesional inicia sesión por primera vez.
     */
    public void cambiarPassword(Usuario usuario, String nuevaPassword) {
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuario.setDebeCambiarPassword(false);
        usuarioRepository.save(usuario);
    }

    /*
     * Crea un usuario con rol ADMINISTRADOR.
     * Usado por el DUENO desde su dashboard.
     * Retorna null si el email ya existe (en vez de lanzar excepción)
     * para que el controller pueda mostrar el error sin romper la página.
     */
    public Usuario crearAdministrador(String nombre, String apellido, String email, String password){
        // Verifica email duplicado
        if (usuarioRepository.existsByEmail(email)) {
            return null; // Retorna null en vez de exception para evitar 500
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRol(RolUsuario.ADMINISTRADOR);
        usuario.setActivo(true);
        usuario.setDebeCambiarPassword(false);

        return usuarioRepository.save(usuario);
    }

    /*
     * Crea un usuario con rol DUENO.
     * Usado por el ADMINISTRADOR desde su dashboard.
     * Retorna null si el email ya existe.
     */
    public Usuario crearDueno(String nombre, String apellido, String email, String password){
        // Verifica email duplicado
        if (usuarioRepository.existsByEmail(email)) {
            System.out.printf("Usuario existente en el sistema %s\n", email);
            return null; // Retorna null en vez de exception
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRol(RolUsuario.DUENO);
        usuario.setActivo(true);
        usuario.setDebeCambiarPassword(false);

        return usuarioRepository.save(usuario);
    }

}
