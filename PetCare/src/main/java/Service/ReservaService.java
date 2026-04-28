package Service;

import DAO.ReservaDAO;
import model.Reserva;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    private final ReservaDAO reservaDAO;

    public ReservaService(ReservaDAO reservaDAO) {
        this.reservaDAO = reservaDAO;
    }

    public List<Reserva> listarTodos() {
        return reservaDAO.reservaList();
    }

    public Optional<Reserva> buscarPorId(Integer idReserva) {
        return reservaDAO.buscarPorId(idReserva);
    }

    public boolean crear(Reserva reserva) {
        int filasAfectadas = reservaDAO.crear(reserva);
        return filasAfectadas > 0;
    }

    public boolean actualizar(Integer idReserva, Reserva reserva) {
        int filasAfectadas = reservaDAO.actualizar(idReserva, reserva);
        return filasAfectadas > 0;
    }

    public boolean eliminar(Integer idReserva) {
        int filasAfectadas = reservaDAO.eliminar(idReserva);
        return filasAfectadas > 0;
    }
}