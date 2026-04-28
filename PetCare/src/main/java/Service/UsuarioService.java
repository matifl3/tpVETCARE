package Service;

import DAO.UsuarioDAO;
import model.Usuario;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioDAO usuarioDAO;

    public UsuarioService(UsuarioDAO usuarioDAO) {
        this.usuarioDAO = usuarioDAO;
    }

    public List<Usuario> listarTodos() {
        return usuarioDAO.usuarioList();
    }

    public Optional<Usuario> buscarPorId(Integer idUsuario) {
        return usuarioDAO.buscarPorId(idUsuario);
    }

    public boolean crear(Usuario usuario) {
        int filasAfectadas = usuarioDAO.crear(usuario);
        return filasAfectadas > 0;
    }

    public boolean actualizar(Integer idUsuario, Usuario usuario) {
        int filasAfectadas = usuarioDAO.actualizar(idUsuario, usuario);
        return filasAfectadas > 0;
    }

    public boolean eliminarLogico(Integer idUsuario) {
        int filasAfectadas = usuarioDAO.eliminarLogico(idUsuario);
        return filasAfectadas > 0;
    }
}
