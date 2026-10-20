package com.example.PetCare.utils;

import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/*
Clase que centraliza cómo obtener el usuario que está haciendo el request. Está anotada con @Component para que Spring la inyecte donde se necesite.

En una app con Spring Security, el usuario autenticado vive en un lugar específico: SecurityContextHolder.getContext().getAuthentication().
Cada vez que necesitás saber quién es el que está llamando, sacas la info de aca.
Si esto lo hacés a mano en cada service, terminás repitiendo el mismo código en todos lados y es feo de mantener.
AuthUtils lo resuelve: una sola clase con un método getCurrentUsuario() que devuelve el Usuario completo (la entidad, no un string).
Cómo funciona conceptualmente
1. Le pregunta a Spring Security quién está autenticado (SecurityContextHolder).
2. Obtiene el Authentication actual.
3. Saca el name (que suele ser el email o username).
4. Busca el Usuario en la BD por ese email.
5. Lo devuelve. Si no hay nadie autenticado o el usuario no existe, tira una excepción.*/

@Component
public class AuthUtils {

    private final UsuarioRepository usuarioRepository;

    public AuthUtils(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario getCurrentUsuario() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new NoEncontradoException("No hay un usuario autenticado");
        }
        return usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NoEncontradoException("Usuario autenticado no encontrado en la base de datos"));
    }
}
