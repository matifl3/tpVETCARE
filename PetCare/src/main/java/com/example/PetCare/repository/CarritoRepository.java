package com.example.PetCare.repository;

import com.example.PetCare.enums.Estado_Carrito;
import com.example.PetCare.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Integer> {
    Optional<Carrito> findByIdUsuarioAndEstado(int idUsuario, Estado_Carrito estadoCarrito);
    List<Carrito> findByUsuarioIdUsuarioAndEstadoNot(Integer idUsuario, Estado_Carrito estado);
}
