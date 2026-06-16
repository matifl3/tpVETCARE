package com.example.PetCare.repository;

import com.example.PetCare.dto.MascotaDTO;
import com.example.PetCare.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Integer> {
    List<Mascota> findByEspecieAndActivoTrue(String especie);
    List<Mascota> findByRazaAndActivoTrue(String raza);
    List<Mascota> findByNombreAndActivoTrue(String nombre);

    @Query("SELECT DISTINCT t.mascota FROM Turno t WHERE t.profesional.id = :idProfesional")
    List<Mascota> findMascotasAtendidasPorProfesional(@Param("idProfesional") int idProfesional);

    List<Mascota> findByUsuario_IdUsuario(Integer idUsuario);
}


