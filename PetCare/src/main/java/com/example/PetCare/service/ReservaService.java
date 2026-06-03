package com.example.PetCare.service;

import com.example.PetCare.dto.ReservaDTO;
import com.example.PetCare.model.Cuidador;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Reserva;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.CuidadorRepository;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.ReservaRepository;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CuidadorRepository cuidadorRepository;
    private final MascotaRepository mascotaRepository;

    public ReservaService(ReservaRepository reservaRepository,
                          UsuarioRepository usuarioRepository,
                          CuidadorRepository cuidadorRepository,
                          MascotaRepository mascotaRepository) {
        this.reservaRepository = reservaRepository;
        this.usuarioRepository = usuarioRepository;
        this.cuidadorRepository = cuidadorRepository;
        this.mascotaRepository = mascotaRepository;
    }

    public List<ReservaDTO> listarTodos() {
        return reservaRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public Optional<ReservaDTO> buscarPorId(Integer idReserva) {
        return reservaRepository.findById(idReserva)
                .map(this::toDTO);
    }

    public boolean crear(ReservaDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario()).orElse(null);
        Cuidador cuidador = cuidadorRepository.findById(dto.getIdCuidador()).orElse(null);
        Mascota mascota = mascotaRepository.findById(dto.getIdMascota()).orElse(null);
        if (usuario == null || cuidador == null || mascota == null) {
            return false;
        }
        Reserva entity = toEntity(dto, usuario, cuidador, mascota);
        reservaRepository.save(entity);
        return true;
    }

    public boolean actualizar(Integer idReserva, ReservaDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario()).orElse(null);
        Cuidador cuidador = cuidadorRepository.findById(dto.getIdCuidador()).orElse(null);
        Mascota mascota = mascotaRepository.findById(dto.getIdMascota()).orElse(null);
        if (usuario == null || cuidador == null || mascota == null) {
            return false;
        }
        return reservaRepository.findById(idReserva)
                .map(entity -> {
                    entity.setFecha(dto.getFecha());
                    entity.setHora(dto.getHora());
                    entity.setServicio(dto.getServicio());
                    entity.setEstado(dto.getEstado());
                    entity.setUsuario(usuario);
                    entity.setCuidador(cuidador);
                    entity.setMascota(mascota);
                    reservaRepository.save(entity);
                    return true;
                })
                .orElse(false);
    }

    public boolean eliminar(Integer idReserva) {
        if (reservaRepository.existsById(idReserva)) {
            reservaRepository.deleteById(idReserva);
            return true;
        }
        return false;
    }

    private ReservaDTO toDTO(Reserva entity) {
        ReservaDTO dto = new ReservaDTO();
        dto.setIdReserva(entity.getIdReserva());
        dto.setFecha(entity.getFecha());
        dto.setHora(entity.getHora());
        dto.setServicio(entity.getServicio());
        dto.setEstado(entity.getEstado());
        dto.setIdUsuario(entity.getUsuario().getIdUsuario());
        dto.setIdCuidador(entity.getCuidador().getIdCuidador());
        dto.setIdMascota(entity.getMascota().getIdMascota());
        return dto;
    }

    private Reserva toEntity(ReservaDTO dto, Usuario usuario, Cuidador cuidador, Mascota mascota) {
        Reserva entity = new Reserva();
        entity.setFecha(dto.getFecha());
        entity.setHora(dto.getHora());
        entity.setServicio(dto.getServicio());
        entity.setEstado(dto.getEstado());
        entity.setUsuario(usuario);
        entity.setCuidador(cuidador);
        entity.setMascota(mascota);
        return entity;
    }
}
