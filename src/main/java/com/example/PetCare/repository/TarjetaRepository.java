package com.example.PetCare.repository;

import com.example.PetCare.model.Tarjeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TarjetaRepository extends JpaRepository<Tarjeta, Integer> {
    List<Tarjeta> findByUsuarioIdUsuarioAndActivoTrue(Integer idUsuario);
}
