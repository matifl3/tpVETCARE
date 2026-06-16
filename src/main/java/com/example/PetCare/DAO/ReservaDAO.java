package com.example.PetCare.DAO;

import com.example.PetCare.model.Reserva;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ReservaDAO {

    private final JdbcTemplate jdbcTemplate;

    public ReservaDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Reserva> reservaRowMapper = (rs, rowNum) -> {
        Reserva r = new Reserva();
        r.setIdReserva(rs.getInt("id_reserva"));
        r.setFecha(rs.getDate("fecha"));
        r.setHora(rs.getTime("hora"));
        r.setServicio(rs.getString("servicio"));
        r.setEstado(rs.getString("estado"));
        r.setIdUsuario(rs.getInt("id_usuario"));
        r.setIdCuidador(rs.getInt("id_cuidador"));
        r.setIdMascota(rs.getInt("id_mascota"));
        return r;
    };

    public List<Reserva> listarTodas() {
        String sql = "SELECT * FROM reserva";
        return jdbcTemplate.query(sql, reservaRowMapper);
    }

    public List<Reserva> listarPorUsuario(Integer idUsuario) {
        String sql = "SELECT * FROM reserva WHERE id_usuario = ?";
        return jdbcTemplate.query(sql, reservaRowMapper, idUsuario);
    }

    public List<Reserva> listarPorCuidador(Integer idCuidador) {
        String sql = "SELECT * FROM reserva WHERE id_cuidador = ?";
        return jdbcTemplate.query(sql, reservaRowMapper, idCuidador);
    }

    public Optional<Reserva> buscarPorId(Integer idReserva) {
        String sql = "SELECT * FROM reserva WHERE id_reserva = ?";
        List<Reserva> reservas = jdbcTemplate.query(sql, reservaRowMapper, idReserva);
        return reservas.stream().findFirst();
    }

    public int crear(Reserva reserva) {
        String sql = """
                INSERT INTO reserva (fecha, hora, servicio, estado, id_usuario, id_cuidador, id_mascota)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;
        return jdbcTemplate.update(
                sql,
                reserva.getFecha(),
                reserva.getHora(),
                reserva.getServicio(),
                reserva.getEstado(),
                reserva.getIdUsuario(),
                reserva.getIdCuidador(),
                reserva.getIdMascota()
        );
    }

    public int actualizarEstado(Integer idReserva, String estado) {
        String sql = "UPDATE reserva SET estado = ? WHERE id_reserva = ?";
        return jdbcTemplate.update(sql, estado, idReserva);
    }

    public int eliminar(Integer idReserva) {
        String sql = "DELETE FROM reserva WHERE id_reserva = ?";
        return jdbcTemplate.update(sql, idReserva);
    }
}
