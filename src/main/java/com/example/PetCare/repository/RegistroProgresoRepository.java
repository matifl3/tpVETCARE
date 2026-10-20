package com.example.PetCare.repository;

import com.example.PetCare.model.RegistroProgreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para los registros de progreso de adiestramiento.
 * Permite buscar registros por seguimiento, por profesional, o por ambos.
 */
@Repository
public interface RegistroProgresoRepository extends JpaRepository<RegistroProgreso, Integer> {
    // Busca todos los registros de un seguimiento específico (ordenados por fecha)
    List<RegistroProgreso> findBySeguimientoIdOrderByFechaDesc(int idSeguimiento);

    // Busca todos los registros creados por un profesional específico
    List<RegistroProgreso> findByProfesionalIdUsuarioOrderByFechaDesc(int idProfesional);

    // Busca registros de un seguimiento creados por un profesional específico
    // Útil para que el adiestrador vea solo sus propios registros de esa mascota
    List<RegistroProgreso> findBySeguimientoIdAndProfesionalIdUsuario(int idSeguimiento, int idProfesional);
}
