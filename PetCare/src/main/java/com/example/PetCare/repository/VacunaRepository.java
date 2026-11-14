package com.example.PetCare.repository;

import com.example.PetCare.model.Vacuna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VacunaRepository extends JpaRepository<Vacuna, Integer> {
    Optional<Vacuna> findByIdAndHistorialClinico_Id(int id, int idHistorial);
}
