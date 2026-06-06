package com.example.PetCare.repository;

import com.example.PetCare.enums.Rol;
import com.example.PetCare.model.Profesional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfesionalRepository extends JpaRepository<Profesional, Integer> {
    List<Profesional> findByRol(Rol rol);
    List<Profesional> findByApellidoContainingIgnoreCase(String apellido);
    Optional<Profesional> findByMatricula(String matricula);
}