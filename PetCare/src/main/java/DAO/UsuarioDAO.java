package DAO;

import model.Usuario;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class UsuarioDAO {
    private final JdbcTemplate jdbcTemplate;

    public UsuarioDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Usuario>usuarioRowMapper = (rs, rowNum) -> {
      Usuario usuario = new Usuario();
      usuario.setIdUsuario(rs.getInt("id_usuario"));
      usuario.setNombre(rs.getString("nombre"));
      usuario.setApellido(rs.getString("apellido"));
      usuario.setTelefono(rs.getString("telefono"));
      usuario.setEmail(rs.getString("email"));
      usuario.setDireccion(rs.getString("direccion"));
      usuario.setActivo(rs.getBoolean("activo"));

      return usuario;
    };
}
