package com.example.PetCare.Service;

import com.example.PetCare.DAO.ReservaDAO;
import com.example.PetCare.model.Reserva;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    private final ReservaDAO reservaDAO;

    public ReservaService(ReservaDAO reservaDAO) {
        this.reservaDAO = reservaDAO;
    }

    public List<Reserva> listarTodas() {
        return reservaDAO.listarTodas();
    }

    public List<Reserva> listarPorUsuario(Integer idUsuario) {
        return reservaDAO.listarPorUsuario(idUsuario);
    }

    public List<Reserva> listarPorCuidador(Integer idCuidador) {
        return reservaDAO.listarPorCuidador(idCuidador);
    }

    public Optional<Reserva> buscarPorId(Integer idReserva) {
        return reservaDAO.buscarPorId(idReserva);
    }

    public boolean crear(Reserva reserva) {
        if (reserva.getEstado() == null || reserva.getEstado().isBlank()) {
            reserva.setEstado("PENDIENTE");
        }
        int filas = reservaDAO.crear(reserva);
        return filas > 0;
    }

    public boolean confirmar(Integer idReserva) {
        return reservaDAO.actualizarEstado(idReserva, "CONFIRMADA") > 0;
    }

    public boolean cancelar(Integer idReserva) {
        return reservaDAO.actualizarEstado(idReserva, "CANCELADA") > 0;
    }

    public boolean eliminar(Integer idReserva) {
        return reservaDAO.eliminar(idReserva) > 0;
    }
}
