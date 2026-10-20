package com.example.PetCare.repository;

import com.example.PetCare.enums.EstadoProfesional;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.model.Profesional;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfesionalRepository extends JpaRepository<Profesional, Integer> {
    // Busca profesionales por rol (VETERINARIO, PASEADOR, etc.)
    List<Profesional> findByRol(Rol rol);

    // Busca profesionales por apellido (búsqueda parcial, ignora mayúsculas/minúsculas)
    List<Profesional> findByApellidoContainingIgnoreCase(String apellido);

    // Busca un profesional por su matrícula (única)
    Optional<Profesional> findByMatricula(String matricula);

    // Busca profesionales por estado de aprobación (PENDIENTE, APROBADO, RECHAZADO)
    List<Profesional> findByEstado(EstadoProfesional estado);

    /**
     * Actualiza el estado de un profesional y su campo activo de forma atómica.
     * Si el nuevo estado es APROBADO, activo se pone en true.
     * Si es RECHAZADO o PENDIENTE, activo se pone en false.
     *
     * @param id ID del profesional
     * @param estado Nuevo estado (APROBADO, RECHAZADO, PENDIENTE)
     * @param activo true si el profesional puede operar, false si no
     * @return cantidad de filas afectadas (1 si éxito, 0 si no encontró)
     */
    @Modifying
    @Transactional
    @Query("UPDATE Profesional p SET p.estado = :estado, p.activo = :activo WHERE p.idUsuario = :id")
    int actualizarEstado(@Param("id") int id,
                         @Param("estado") EstadoProfesional estado,
                         @Param("activo") boolean activo);
}