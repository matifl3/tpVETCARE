package com.example.PetCare.service;

import com.example.PetCare.dto.TurnoDTO;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.Turno;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.TurnoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TurnoService {
    private final TurnoRepository turnoRepository;
    private final MascotaRepository mascotaRepository;
    private final ProfesionalRepository profesionalRepository;

    public TurnoService(TurnoRepository turnoRepository, MascotaRepository mascotaRepository, ProfesionalRepository profesionalRepository) {
        this.turnoRepository = turnoRepository;
        this.mascotaRepository = mascotaRepository;
        this.profesionalRepository = profesionalRepository;
    }

    public List<TurnoDTO> listarTodos() {
        return turnoRepository.findAll().stream()
                .map(a -> toDTO(a))
                .toList();
    }

    public List<TurnoDTO> listarTodosTurnosActivos() {
        return turnoRepository.findAllByActivoTrue().stream()
                .map(a -> toDTO(a)).toList();
    }

    public List<TurnoDTO> listarTurnoXMascota(Integer idMascota) {
        return turnoRepository.findByMascotaIdMascota(idMascota).stream().map(a -> toDTO(a)).toList();
    }

    public List<TurnoDTO> listarTurnoXProfesional(Integer idProfesional) {
        return turnoRepository.findByProfesionalIdUsuario(idProfesional).stream().map(a -> toDTO(a)).toList();
    }

    public List<TurnoDTO> listarFechaBefore(LocalDate fecha) {
        return turnoRepository.findByFechaBefore(fecha).stream().map(a -> toDTO(a)).toList();
    }

    public List<TurnoDTO> listarFechaAfter(LocalDate fecha) {
        return turnoRepository.findByFechaAfter(fecha).stream().map(a -> toDTO(a)).toList();
    }

    public List<TurnoDTO> listarFechaMascota(LocalDate fecha) {
        return turnoRepository.findByFecha(fecha).stream()
                .map(this::toDTO)
                .toList();
    }

    public Turno crear(TurnoDTO dto) {
        Mascota mascota = mascotaRepository.findById(dto.getId_mascota())
                .orElseThrow(() -> new NoEncontradoException("Mascota no encontrada"));
        Profesional profesional = profesionalRepository.findById(dto.getId_profesional())
                .orElseThrow(() -> new NoEncontradoException("Profesional no encontrado"));
        Turno entity = toEntity(dto, mascota, profesional);
        return turnoRepository.save(entity);
    }

    public boolean eliminar(Integer idturno) {
        if (turnoRepository.existsById(idturno)) {
            turnoRepository.deleteById(idturno);
            return true;
        }
        return false;
    }


    public Turno actualizar(Integer idTurno, TurnoDTO dto) {
        Mascota mascota = mascotaRepository.findById(dto.getId_mascota()).orElseThrow(() -> new NoEncontradoException("Mascot no existe"));
        Profesional profesional = profesionalRepository.findById(dto.getId_profesional()).orElseThrow(() -> new NoEncontradoException("Profesional no existe"));
        Turno turno = turnoRepository.findById(idTurno)
                .map(a -> toEntity(dto, mascota, profesional))
                .orElse(null);
        return turnoRepository.save(turno);
    }

    public boolean cancelaTurno(Integer idTurno) {
        return turnoRepository.cancelarTurno(idTurno) > 0;
    }

    public boolean confirmarTurno(Integer idTurno) {
        return turnoRepository.confirmarTurno(idTurno) > 0;
    }


    /// pasa de dto a entidad
    private TurnoDTO toDTO(Turno entity) {
        TurnoDTO dto = new TurnoDTO();
        dto.setId(entity.getIdTurno());
        dto.setEstadoTurno(entity.getEstadoTurno());
        dto.setFecha(entity.getFecha());
        dto.setId_mascota(entity.getMascota().getIdMascota());
        dto.setId_profesional(entity.getProfesional().getIdUsuario());
        return dto;
    }

    /// pasa de entidad a dto
    private Turno toEntity(TurnoDTO dto, Mascota mascota, Profesional profesional) {
        Turno entity = new Turno();
        entity.setEstadoTurno(dto.getEstadoTurno());
        entity.setFecha(dto.getFecha());
        entity.setIdTurno(dto.getId());
        entity.setMascota(mascota);
        entity.setProfesional(profesional);
        return entity;
    }
}
