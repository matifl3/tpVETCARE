package com.example.PetCare.Service;

import com.example.PetCare.DAO.CuidadorDAO;
import com.example.PetCare.model.Cuidador;
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
        return cuidadorDAO.listarTodos();
    }

    public List<Cuidador> listarDisponibles() {
        return cuidadorDAO.listarDisponibles();
    }

    public Optional<Cuidador> buscarPorId(Integer idCuidador) {
        return cuidadorDAO.buscarPorId(idCuidador);
    }

    public boolean crear(Cuidador cuidador) {
        return cuidadorDAO.crear(cuidador) > 0;
    }

    public boolean actualizar(Integer idCuidador, Cuidador cuidador) {
        return cuidadorDAO.actualizar(idCuidador, cuidador) > 0;
    }

    public boolean eliminar(Integer idCuidador) {
        return cuidadorDAO.eliminar(idCuidador) > 0;
    }
}
