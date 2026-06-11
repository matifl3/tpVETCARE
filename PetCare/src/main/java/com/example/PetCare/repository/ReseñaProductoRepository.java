package com.example.PetCare.repository;

import com.example.PetCare.model.ReseñaProducto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReseñaProductoRepository extends JpaRepository<ReseñaProducto,Integer> {
    @Modifying
    @Transactional
    @Query("UPDATE ReseñaProducto r SET r.activo = true WHERE r.id = :id")
    int aprobarReseña(@Param("id") Integer id);

    @Modifying
    @Transactional
    @Query("UPDATE ReseñaProducto r SET r.activo = false WHERE r.id = :id")
    int desaprobarReseña(@Param("id") Integer id);
}
