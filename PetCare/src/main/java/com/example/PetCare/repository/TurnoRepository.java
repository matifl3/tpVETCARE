package com.example.PetCare.repository;

import com.example.PetCare.enums.Estado_Turno;
import com.example.PetCare.model.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Integer> {
    List<Turno> findAllByActivoTrue();
    List<Turno> findByMascotaIdMascota(Integer idMascota);
    List<Turno> findByProfesionalIdUsuario(Integer id);

    List<Turno> findByFechaBefore(LocalDate fecha);   // turnos antes de una fecha
    List<Turno> findByFechaAfter(LocalDate fecha);    // turnos después de una fecha
    List<Turno> findByFecha(LocalDate fecha);         // turnos en una fecha exacta

    List<Turno> findByMascota_Usuario_IdUsuario(Integer idUsuario);

    List<Turno> findByProfesionalIdUsuarioAndFecha(Integer idProfesional, LocalDate fecha);


    @Modifying
    @Query("UPDATE Turno t SET t.estadoTurno = :estado WHERE t.idTurno = :idTurno")
    int cancelarTurno(@Param("idTurno") Integer idTurno, @Param("estado") Estado_Turno estado);

    @Modifying
    @Query("UPDATE Turno t SET t.estadoTurno = :estado WHERE t.idTurno = :idTurno")
    int confirmarTurno(@Param("idTurno") Integer idTurno, @Param("estado") Estado_Turno estado);

    // @Modifying le dice a Spring Data JPA que el
    // método no es una consulta SELECT, sino una operación de escritura
    // (UPDATE, DELETE o incluso INSERT). Sin esta anotación,
    // Spring asume que es un SELECT
    // y ejecuta el método como una consulta de solo lectura.

    /*@Param vincula el nombre del parámetro en el método Java (idTurno)
     con el placeholder :idTurno dentro del JPQL de @Query. Sin él,
    Spring Data JPA no sabría cómo mapear el argumento al placeholder en la query.*/

}
