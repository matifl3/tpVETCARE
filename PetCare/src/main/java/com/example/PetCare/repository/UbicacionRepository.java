package com.example.PetCare.repository;

import com.example.PetCare.model.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UbicacionRepository extends JpaRepository<Ubicacion, Integer> {
    List<Ubicacion> findByPaseoIdPaseoOrderByTimestampAsc(Integer idPaseo);
}
