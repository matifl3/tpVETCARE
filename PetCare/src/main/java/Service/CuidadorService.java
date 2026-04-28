package Service;


import DAO.CuidadorDAO;
import model.Cuidador;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CuidadorService {

    private final CuidadorDAO cuidadorDAO;

    public CuidadorService(CuidadorDAO cuidadorDAO) {
        this.cuidadorDAO = cuidadorDAO;
    }

    public List<Cuidador> listarTodos() {
        return cuidadorDAO.cuidadorList();
    }

    public Optional<Cuidador> buscarPorId(Integer idCuidador) {
        return cuidadorDAO.buscarPorId(idCuidador);
    }

    public boolean crear(Cuidador cuidador) {
        int filasAfectadas = cuidadorDAO.crear(cuidador);
        return filasAfectadas > 0;
    }

    public boolean actualizar(Integer idCuidador, Cuidador cuidador) {
        int filasAfectadas = cuidadorDAO.actualizar(idCuidador, cuidador);
        return filasAfectadas > 0;
    }

    public boolean eliminar(Integer idCuidador) {
        int filasAfectadas = cuidadorDAO.eliminar(idCuidador);
        return filasAfectadas > 0;
    }
}