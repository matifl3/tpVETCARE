package com.example.PetCare.repository;

import com.example.PetCare.model.SeguimientoEntrenamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository para el seguimiento de adiestramiento.
 * Busca el contenedor de seguimiento por ID de mascota.
 */
@Repository
public interface SeguimientoEntrenamientoRepository extends JpaRepository<SeguimientoEntrenamiento, Integer> {
    // Busca el seguimiento de adiestramiento de una mascota específica
    // Cada mascota tiene como máximo un seguimiento (relación 1-to-1)
    Optional<SeguimientoEntrenamiento> findByMascota_IdMascota(int idMascota);
}
