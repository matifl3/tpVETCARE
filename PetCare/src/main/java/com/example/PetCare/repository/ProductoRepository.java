package com.example.PetCare.repository;

import com.example.PetCare.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto,Integer> {
    List<Producto> findByCategoria(String categoria);
    List<Producto> findByNombre(String nombre);
    List<Producto> findByPrecioLessThan(Double precio);
    List<Producto> findByPrecioGreaterThan(Double precio);
    List<Producto> findByActivo(Boolean activo);
    List<Producto> findByStockLessThan(Integer stock);
    boolean existsByNombreIgnoreCase(String nombre);
}
