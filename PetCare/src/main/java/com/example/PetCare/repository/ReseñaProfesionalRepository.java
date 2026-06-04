package com.example.PetCare.repository;

import com.example.PetCare.model.ReseñaProfesional;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReseñaProfesionalRepository extends JpaRepository<ReseñaProfesional, Integer> {
    List<ReseñaProfesional> findByFechaBefore(LocalDate fecha);   // turnos antes de una fecha
    List<ReseñaProfesional> findByFechaAfter(LocalDate fecha);    // turnos después de una fecha
    List<ReseñaProfesional> findByFecha(LocalDate fecha);         // turnos en una fecha exacta
    List<ReseñaProfesional> findByPuntuacion(Integer puntuacion);
    List<ReseñaProfesional> findByActivo(boolean activo);

    @Modifying
    @Transactional
    @Query("UPDATE ReseñaProfesional r SET r.activo = true WHERE r.id = :id")
    int aprobarReseña(@Param("id") Integer id);

    @Modifying
    @Transactional
    @Query("UPDATE ReseñaProfesional r SET r.activo = false WHERE r.id = :id")
    int desaprobarReseña(@Param("id") Integer id);
}
