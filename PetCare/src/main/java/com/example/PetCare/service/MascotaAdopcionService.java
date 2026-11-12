package com.example.PetCare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.PetCare.dto.MascotaAdopcionDTO;
import com.example.PetCare.enums.EstadoAdopcionMascota;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.MascotaAdopcion;
import com.example.PetCare.repository.MascotaAdopcionRepository;

import jakarta.transaction.Transactional;

@Service 
@Transactional 
public class MascotaAdopcionService {
    private final MascotaAdopcionRepository mascotaAdopcionRepository;

    public MascotaAdopcionService(MascotaAdopcionRepository mascotaAdopcionRepository){
        this.mascotaAdopcionRepository = mascotaAdopcionRepository;
    }

    /// listados
    public List<MascotaAdopcionDTO> listarTodos() {
        return mascotaAdopcionRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public Optional<MascotaAdopcionDTO> buscarPorId(Integer idMascotaAdopcion) {
        return mascotaAdopcionRepository.findById(idMascotaAdopcion)
                .map(this::toDTO);
    }

    public List<MascotaAdopcionDTO> buscarPorEspecie(String especie) {
        return mascotaAdopcionRepository.findByMascotaEspecieAndEstado(especie, EstadoAdopcionMascota.DISPONIBLE).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MascotaAdopcionDTO> buscarPorRaza(String raza) {
        return mascotaAdopcionRepository.findByMascotaRazaAndEstado(raza, EstadoAdopcionMascota.DISPONIBLE).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MascotaAdopcionDTO> listarDisponibles() {
        return mascotaAdopcionRepository.findByEstado(EstadoAdopcionMascota.DISPONIBLE).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MascotaAdopcionDTO> listarAdoptadas() {
        return mascotaAdopcionRepository.findByEstado(EstadoAdopcionMascota.ADOPTADA).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MascotaAdopcionDTO> listarPausadas() {
        return mascotaAdopcionRepository.findByEstado(EstadoAdopcionMascota.PAUSADA).stream()
                .map(this::toDTO)
                .toList();
    }

    /// pasa de entidad a dto
    public MascotaAdopcionDTO toDTO(MascotaAdopcion entity) {
        MascotaAdopcionDTO dto = new MascotaAdopcionDTO();
        dto.setIdMascotaAdopcion(entity.getIdMascotaAdopcion());
        dto.setIdMascota(entity.getMascota().getIdMascota());
        dto.setNombre(entity.getMascota().getNombre());
        dto.setEspecie(entity.getMascota().getEspecie());
        dto.setRaza(entity.getMascota().getRaza());
        dto.setSexo(entity.getMascota().getSexo());
        dto.setPeso(entity.getMascota().getPeso());
        dto.setFechaNacimiento(entity.getMascota().getFechaNacimiento());
        dto.setObservaciones(entity.getMascota().getObservaciones());
        dto.setTamanio(entity.getTamanio());
        dto.setFoto(entity.getFoto());
        dto.setDescripcion(entity.getDescripcion());
        dto.setCastrado(entity.isCastrado());
        dto.setDesparasitado(entity.isDesparasitado());
        dto.setEstado(entity.getEstado());
        dto.setFechaPublicacion(entity.getFechaPublicacion());
        dto.setVacunas(entity.getMascota().getHistorialClinico().getVacunas().stream()
                .map(vacuna -> vacuna.getNombre())
                .toList());
        return dto;
    }

    /// pasa de dto a entidad
    public MascotaAdopcion toEntity(MascotaAdopcionDTO dto, Mascota mascota) {
        MascotaAdopcion entity = new MascotaAdopcion();
        entity.setMascota(mascota);
        entity.setTamanio(dto.getTamanio());
        entity.setFoto(dto.getFoto());
        entity.setDescripcion(dto.getDescripcion());
        entity.setCastrado(dto.isCastrado());
        entity.setDesparasitado(dto.isDesparasitado());
        entity.setEstado(dto.getEstado());
        return entity;
    }
}
