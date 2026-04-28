package DAO;

import model.Cuidador;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CuidadorDAO {

    private final JdbcTemplate jdbcTemplate;

    public CuidadorDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Cuidador> cuidadorRowMapper = (rs, rowNum) -> {
        Cuidador c = new Cuidador();
        c.setIdCuidador(rs.getInt("id_cuidador"));
        c.setNombre(rs.getString("nombre"));
        c.setApellido(rs.getString("apellido"));
        c.setEspecialidad(rs.getString("especialidad"));
        c.setTelefono(rs.getString("telefono"));
        c.setEmail(rs.getString("email"));
        c.setDisponible(rs.getBoolean("disponible"));
        return c;
    };

    public List<Cuidador> cuidadorList() {
        String sql = "SELECT * FROM cuidador";
        return jdbcTemplate.query(sql, cuidadorRowMapper);
    }

    public Optional<Cuidador> buscarPorId(Integer idCuidador) {
        String sql = """
                SELECT * FROM cuidador
                WHERE id_cuidador = ?
                """;

        List<Cuidador> cuidadores = jdbcTemplate.query(sql, cuidadorRowMapper, idCuidador);

        return cuidadores.stream().findFirst();
    }

    public int crear(Cuidador cuidador) {
        String sql = """
                INSERT INTO cuidador
                (nombre, apellido, especialidad, telefono, email, disponible)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                cuidador.getNombre(),
                cuidador.getApellido(),
                cuidador.getEspecialidad(),
                cuidador.getTelefono(),
                cuidador.getEmail(),
                cuidador.isDisponible()
        );
    }

    public int actualizar(Integer idCuidador, Cuidador cuidador) {
        String sql = """
                UPDATE cuidador
                SET nombre = ?, apellido = ?, especialidad = ?, telefono = ?, email = ?, disponible = ?
                WHERE id_cuidador = ?
                """;

        return jdbcTemplate.update(
                sql,
                cuidador.getNombre(),
                cuidador.getApellido(),
                cuidador.getEspecialidad(),
                cuidador.getTelefono(),
                cuidador.getEmail(),
                cuidador.isDisponible(),
                idCuidador
        );
    }

    public int eliminar(Integer idCuidador) {
        String sql = """
                DELETE FROM cuidador
                WHERE id_cuidador = ?
                """;

        return jdbcTemplate.update(sql, idCuidador);
    }
}