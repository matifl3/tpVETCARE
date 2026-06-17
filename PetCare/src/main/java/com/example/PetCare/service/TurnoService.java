package com.example.PetCare.service;

import com.example.PetCare.dto.TurnoDTO;
import com.example.PetCare.enums.Estado_Turno;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.Turno;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.TurnoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
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

    public List<TurnoDTO> listarPorDuenio(Integer idDuenio) {
        return turnoRepository.findByMascota_Usuario_IdUsuario(idDuenio).stream()
                .map(this::toDTO)
                .toList();
    }

    public void verificarDisponibilidad(Integer idProfesional, LocalDate fecha) {
        if (!estaDisponible(idProfesional, fecha)) {
            throw new IllegalArgumentException(
                "El profesional no tiene disponibilidad para la fecha " + fecha);
        }
    }

    public boolean estaDisponible(Integer idProfesional, LocalDate fecha) {
        List<Turno> existentes = turnoRepository.findByProfesionalIdUsuarioAndFechaAndActivoTrueAndEstadoTurno(
            idProfesional, fecha, Estado_Turno.CONFIRMADO);
        return existentes.isEmpty();
    }

    public TurnoDTO solicitar(TurnoDTO dto) {
        Mascota mascota = mascotaRepository.findById(dto.getId_mascota())
                .orElseThrow(() -> new NoEncontradoException("Mascota no encontrada"));
        Profesional profesional = profesionalRepository.findById(dto.getId_profesional())
                .orElseThrow(() -> new NoEncontradoException("Profesional no encontrado"));

        Profesional fullProf = profesionalRepository.findById(profesional.getIdUsuario())
                .orElseThrow(() -> new NoEncontradoException("Profesional no encontrado"));

        verificarDisponibilidad(dto.getId_profesional(), dto.getFecha());

        double[] precios = ProfesionalService.calcularPrecios(fullProf.getRol());
        double precioBase = precios[0];
        double precioHora = precios[1];
        int horas = dto.getHoras() != null ? dto.getHoras() : 1;
        double total = precioBase + (precioHora * (horas - 1));

        dto.setEstadoTurno(Estado_Turno.CONFIRMADO);
        dto.setActivo(true);
        dto.setHoras(horas);
        dto.setPrecio(total);
        Turno entity = toEntity(dto, mascota, profesional);
        return toDTO(turnoRepository.save(entity));
    }

    public TurnoDTO crear(TurnoDTO dto) {
        Mascota mascota = mascotaRepository.findById(dto.getId_mascota())
                .orElseThrow(() -> new NoEncontradoException("Mascota no encontrada"));
        Profesional profesional = profesionalRepository.findById(dto.getId_profesional())
                .orElseThrow(() -> new NoEncontradoException("Profesional no encontrado"));
        Turno entity = toEntity(dto, mascota, profesional);
        return toDTO(turnoRepository.save(entity));
    }

    public boolean eliminar(Integer idturno) {
        if (turnoRepository.existsById(idturno)) {
            turnoRepository.deleteById(idturno);
            return true;
        }
        return false;
    }


    public TurnoDTO actualizar(Integer idTurno, TurnoDTO dto) {
        Mascota mascota = mascotaRepository.findById(dto.getId_mascota()).orElseThrow(() -> new NoEncontradoException("Mascota no existe"));
        Profesional profesional = profesionalRepository.findById(dto.getId_profesional()).orElseThrow(() -> new NoEncontradoException("Profesional no existe"));
        Turno turno = turnoRepository.findById(idTurno).orElseThrow(() -> new NoEncontradoException("El turno no existe"));
        turno.setFecha(dto.getFecha());
        turno.setEstadoTurno(dto.getEstadoTurno());
        turno.setMascota(mascota);
        turno.setProfesional(profesional);
        turno.setActivo(Boolean.TRUE.equals(dto.getActivo()));
        return toDTO(turnoRepository.save(turno));
    }
    // Godoy
    // Ahora el método busca la entidad existente y muta sus campos directamente. Como la entidad ya tiene un ID válido, save() hace un UPDATE en vez de un INSERT.

    public boolean cancelaTurno(Integer idTurno) {
        return turnoRepository.cancelarTurno(idTurno, Estado_Turno.CANCELADO) > 0;
    }

    public boolean confirmarTurno(Integer idTurno) {
        return turnoRepository.confirmarTurno(idTurno, Estado_Turno.CONFIRMADO) > 0;
    }


    /// pasa de entidad a dto
    private TurnoDTO toDTO(Turno entity) {
        TurnoDTO dto = new TurnoDTO();
        dto.setId(entity.getIdTurno());
        dto.setEstadoTurno(entity.getEstadoTurno());
        dto.setFecha(entity.getFecha());
        dto.setId_mascota(entity.getMascota().getIdMascota());
        dto.setId_profesional(entity.getProfesional().getIdUsuario());
        dto.setNombreProfesional(entity.getProfesional().getNombre() + " " + entity.getProfesional().getApellido());
        dto.setNombreMascota(entity.getMascota().getNombre());
        dto.setHoras(entity.getHoras());
        dto.setPrecio(entity.getPrecio());
        dto.setActivo(entity.isActivo());
        return dto;
    }

    /// pasa de dto a entidad
    private Turno toEntity(TurnoDTO dto, Mascota mascota, Profesional profesional) {
        Turno entity = new Turno();
        entity.setEstadoTurno(dto.getEstadoTurno());
        entity.setFecha(dto.getFecha());
        if (dto.getId() != null) entity.setIdTurno(dto.getId());
        entity.setMascota(mascota);
        entity.setProfesional(profesional);
        entity.setHoras(dto.getHoras());
        entity.setPrecio(dto.getPrecio());
        entity.setActivo(Boolean.TRUE.equals(dto.getActivo()));
        return entity;
    }
}
