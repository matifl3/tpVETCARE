package com.example.PetCare.repository;

import com.example.PetCare.enums.EstadoPaseo;
import com.example.PetCare.model.Paseo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaseoRepository extends JpaRepository<Paseo, Integer> {
    List<Paseo> findByPaseadorIdUsuarioAndEstadoAndActivoTrue(Integer idPaseador, EstadoPaseo estado);
    List<Paseo> findByPaseadorIdUsuarioAndActivoTrue(Integer idPaseador);
    List<Paseo> findByClienteIdUsuarioAndActivoTrue(Integer idCliente);
}
