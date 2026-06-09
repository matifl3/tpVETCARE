package com.example.PetCare.repository;

import com.example.PetCare.enums.Estado_Carrito;
import com.example.PetCare.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarritoRepository extends JpaRepository<Carrito, Integer> {
    Optional<Carrito> findByIdUsuarioAndEstado(int idUsuario, Estado_Carrito estadoCarrito);
    List<Carrito> findByUsuarioIdUsuarioAndEstadoNot(Integer idUsuario, Estado_Carrito estado);
}
