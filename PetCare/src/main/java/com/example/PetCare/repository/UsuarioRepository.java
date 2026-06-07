package com.example.PetCare.repository;

import com.example.PetCare.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    // Le agregue findByEmail que lo usa el AuthUtils
    Optional<Usuario> findByEmail(String email);
}
