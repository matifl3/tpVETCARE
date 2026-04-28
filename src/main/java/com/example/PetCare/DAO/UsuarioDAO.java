package com.example.PetCare.DAO;

import com.example.PetCare.model.Usuario;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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

    public List<Usuario> usuarioList(){
        String sql="SELECT * FROM usuario WHERE activo=true";
        return jdbcTemplate.query(sql,usuarioRowMapper);
    }



    public Optional<Usuario> buscarPorId(Integer idUsuario) {
        String sql = """
            SELECT *
            FROM usuario
            WHERE id_usuario = ? AND activo = TRUE
            """;

        List<Usuario> usuarios = jdbcTemplate.query(sql, usuarioRowMapper, idUsuario);

        return usuarios.stream().findFirst();
    }


    public int crear(Usuario usuario) {
        String sql = """
            INSERT INTO usuario
            (nombre, apellido, telefono, email, direccion)
            VALUES (?, ?, ?, ?, ?)
            """;

        return jdbcTemplate.update(
                sql,
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getTelefono(),
                usuario.getEmail(),
                usuario.getDireccion()
        );
    }


    public int actualizar(Integer idUsuario, Usuario usuario) {
        String sql = """
            UPDATE usuario
            SET nombre = ?, apellido = ?, telefono = ?, email = ?, direccion = ?
            WHERE id_usuario = ? AND activo = TRUE
            """;

        return jdbcTemplate.update(
                sql,
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getTelefono(),
                usuario.getEmail(),
                usuario.getDireccion(),
                idUsuario
        );
    }


    public int eliminarLogico(Integer idUsuario) {
        /*
         * No borramos físicamente el registro.
         * Solo lo marcamos como inactivo.
         */
        String sql = """
            UPDATE usuario
            SET activo = FALSE
            WHERE id_usuario = ? AND activo = TRUE
            """;

        return jdbcTemplate.update(sql, idUsuario);
    }
}
