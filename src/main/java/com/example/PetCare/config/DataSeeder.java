package com.example.PetCare.config;

import com.example.PetCare.model.RolUsuario;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataSeeder(UsuarioRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Se ejecuta automaticamente al iniciar la aplicacion (despues de cargar el contexto de Spring).
    // Verifica si ya existe un usuario con rol DUENO. Si no existe, crea el dueño principal
    // con las credenciales solicitadas por el dueño de la veterinaria.
    // - Matias Z.
    @Override
    public void run(String... args) {
        List<Usuario> duenos = usuarioRepository.findAll()
                .stream()
                .filter(usuario -> usuario.getRol() == RolUsuario.DUENO)
                .toList();

        if (duenos.isEmpty()) {
            Usuario usuario = new Usuario();
            usuario.setRol(RolUsuario.DUENO);
            usuario.setNombre("Indio");
            usuario.setApellido("Solari");
            usuario.setEmail("duenoPetCare@gmail.com");
            // La contraseña se hashea con BCrypt para que coincida con la verificación
            // en AuthService.autenticar(), que usa BCryptPasswordEncoder.matches().
            usuario.setPassword(passwordEncoder.encode("Vete2026"));
            usuario.setActivo(true);
            usuario.setTelefono("2235655840");
            usuario.setDebeCambiarPassword(false);
            usuarioRepository.save(usuario);
            System.out.println("[DataSeeder] Usuario DUENO creado: duenoPetCare@gmail.com");
        }
    }
}
