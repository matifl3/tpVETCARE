package DAO;

import model.Mascota;
import model.Usuario;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class MascotaDAO  {

    private final JdbcTemplate jdbcTemplate;

    public MascotaDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Mascota> mascotaRowMapper = (rs, rowNum) -> {
        Mascota m = new Mascota();
        m.setIdMascota(rs.getInt("id_mascota"));
        m.setNombre(rs.getString("nombre"));
        m.setEspecie(rs.getString("especie"));
        m.setRaza(rs.getString("raza"));
        m.setEdad(rs.getInt("edad"));
        m.setPeso(rs.getDouble("peso"));
        m.setIdUsuario(rs.getInt("id_usuario"));
        return m;
    };

    public List<Mascota> mascotaList(){
        String sql="SELECT * FROM mascota WHERE activo=true";
        return jdbcTemplate.query(sql,mascotaRowMapper);
    }
    public Optional<Mascota> buscarPorId(Integer idMascota) {
        String sql = """
                SELECT id_mascota, nombre, especie, raza, edad, peso, id_usuario
                FROM mascota
                WHERE id_mascota = ?
                """;

        List<Mascota> mascotas = jdbcTemplate.query(sql, mascotaRowMapper, idMascota);

        return mascotas.stream().findFirst();
    }


    public int crear(Mascota mascota) {
        String sql = """
                INSERT INTO mascota
                (nombre, especie, raza, edad, peso, id_usuario)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                mascota.getNombre(),
                mascota.getEspecie(),
                mascota.getRaza(),
                mascota.getEdad(),
                mascota.getPeso(),
                mascota.getIdUsuario()
        );
    }


    public int actualizar(Integer idMascota, Mascota mascota) {
        String sql = """
                UPDATE mascota
                SET nombre = ?, especie = ?, raza = ?, edad = ?, peso = ?, id_usuario = ?
                WHERE id_mascota = ?
                """;

        return jdbcTemplate.update(
                sql,
                mascota.getNombre(),
                mascota.getEspecie(),
                mascota.getRaza(),
                mascota.getEdad(),
                mascota.getPeso(),
                mascota.getIdUsuario(),
                idMascota
        );
    }

    public int eliminar(Integer idMascota) {
        String sql = """
                DELETE FROM mascota
                WHERE id_mascota = ?
                """;

        return jdbcTemplate.update(sql, idMascota);
    }
}
