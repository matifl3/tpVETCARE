package com.example.PetCare.Service;


import com.example.PetCare.DAO.MascotaDAO;
import com.example.PetCare.model.Mascota;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MascotaService {

    private final MascotaDAO mascotaDAO;

    public MascotaService(MascotaDAO mascotaDAO) {
        this.mascotaDAO = mascotaDAO;
    }

    public List<Mascota> listarTodos() {
        return mascotaDAO.mascotaList();
    }

    public Optional<Mascota> buscarPorId(Integer idMascota) {
        return mascotaDAO.buscarPorId(idMascota);
    }

    public boolean crear(Mascota mascota) {
        int filasAfectadas = mascotaDAO.crear(mascota);
        return filasAfectadas > 0;
    }

    public void guardar(Mascota mascota){
        System.out.println("Mascota guardada: " + mascota.getNombre());
    }
    public boolean actualizar(Integer idMascota, Mascota mascota) {
        int filasAfectadas = mascotaDAO.actualizar(idMascota, mascota);
        return filasAfectadas > 0;
    }
    public boolean eliminar(Integer idMascota) {
        int filasAfectadas = mascotaDAO.eliminar(idMascota);
        return filasAfectadas > 0;
    }
}