package com.example.PetCare.repository;

import com.example.PetCare.dto.MascotaDTO;
import com.example.PetCare.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Integer> {
    List<Mascota> findByEspecieAndActivoTrue(String especie);
    List<Mascota> findByRazaAndActivoTrue(String especie);
    List<Mascota> findByNombreAndActivoTrue(String especie);


}
