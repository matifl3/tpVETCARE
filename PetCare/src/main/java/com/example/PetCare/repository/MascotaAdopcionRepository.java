package com.example.PetCare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.PetCare.enums.EstadoAdopcionMascota;
import com.example.PetCare.model.MascotaAdopcion;

@Repository 
public interface MascotaAdopcionRepository extends JpaRepository<MascotaAdopcion, Integer>{
    List<MascotaAdopcion> findByMascotaEspecieAndEstado(String especie, EstadoAdopcionMascota estado);

    List<MascotaAdopcion> findByMascotaRazaAndEstado(String raza, EstadoAdopcionMascota estado);

    List<MascotaAdopcion> findByEstado(EstadoAdopcionMascota estado);

    // Validar que una mascota no tenga ya una publicación creada
    boolean existsByMascotaIdMascota(int idMascota);
}
