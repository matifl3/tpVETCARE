package com.example.PetCare.repository;

import com.example.PetCare.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, Integer> {
    Optional<Medicamento> findByIdAndHistorialClinico_Id(int id, int idHistorial);
}
