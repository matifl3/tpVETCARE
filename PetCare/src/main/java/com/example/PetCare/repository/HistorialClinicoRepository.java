package com.example.PetCare.repository;

import com.example.PetCare.model.HistorialClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HistorialClinicoRepository extends JpaRepository<HistorialClinico, Integer> {
    Optional<HistorialClinico> findByMascota_IdMascota(int idMascota);
}
