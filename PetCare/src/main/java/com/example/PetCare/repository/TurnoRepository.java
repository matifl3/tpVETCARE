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

    List<Turno> findByProfesionalIdUsuarioAndFechaAndActivoTrueAndEstadoTurno(
        Integer idProfesional, LocalDate fecha, Estado_Turno estadoTurno);


    @Modifying
    @Query("UPDATE Turno t SET t.estadoTurno = :estado, t.activo = false WHERE t.idTurno = :idTurno")
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

    // ==================== ESTADÍSTICAS (SOLO ADMIN) ====================
    // Todas las consultas son nativas porque usan DATE_FORMAT de MySQL.
    // Solo se consideran turnos activos y no cancelados.

    @Query(value = """
            SELECT DATE_FORMAT(t.fecha, :formato) AS periodo, COUNT(*) AS cantidad
            FROM turno t
            WHERE t.activo = 1
              AND t.estado_turno <> 'CANCELADO'
              AND t.fecha BETWEEN :desde AND :hasta
            GROUP BY DATE_FORMAT(t.fecha, :formato)
            ORDER BY periodo
            """, nativeQuery = true)
    List<Object[]> contarTurnosPorPeriodo(@Param("desde") LocalDate desde,
                                          @Param("hasta") LocalDate hasta,
                                          @Param("formato") String formato);

    @Query(value = """
            SELECT u.rol AS servicio, COUNT(*) AS cantidad
            FROM turno t
            JOIN usuario u ON u.id_usuario = t.id_profesional
            WHERE t.activo = 1
              AND t.estado_turno <> 'CANCELADO'
              AND t.fecha BETWEEN :desde AND :hasta
            GROUP BY u.rol
            ORDER BY cantidad DESC, u.rol ASC
            """, nativeQuery = true)
    List<Object[]> contarTurnosPorServicio(@Param("desde") LocalDate desde,
                                           @Param("hasta") LocalDate hasta);

    @Query(value = """
            SELECT COUNT(*) AS total,
                   COALESCE(SUM(CASE WHEN t.estado_turno = 'CONFIRMADO' THEN 1 ELSE 0 END), 0) AS confirmados,
                   COALESCE(SUM(CASE WHEN t.fecha >= CURRENT_DATE THEN 1 ELSE 0 END), 0) AS proximos
            FROM turno t
            WHERE t.activo = 1
              AND t.estado_turno <> 'CANCELADO'
              AND t.fecha BETWEEN :desde AND :hasta
            """, nativeQuery = true)
    List<Object[]> resumirTurnos(@Param("desde") LocalDate desde,
                                 @Param("hasta") LocalDate hasta);

    @Query(value = """
            SELECT COUNT(*) AS cancelados
            FROM turno t
            WHERE t.activo = 1
              AND t.estado_turno = 'CANCELADO'
              AND t.fecha BETWEEN :desde AND :hasta
            """, nativeQuery = true)
    long contarTurnosCancelados(@Param("desde") LocalDate desde,
                                @Param("hasta") LocalDate hasta);

}
