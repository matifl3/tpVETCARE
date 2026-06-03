package com.example.PetCare.service;

import com.example.PetCare.dto.CuidadorDTO;
import com.example.PetCare.model.Cuidador;
import com.example.PetCare.repository.CuidadorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CuidadorService {

    private final CuidadorRepository cuidadorRepository;

    public CuidadorService(CuidadorRepository cuidadorRepository) {
        this.cuidadorRepository = cuidadorRepository;
    }

    public List<CuidadorDTO> listarTodos() {
        return cuidadorRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public Optional<CuidadorDTO> buscarPorId(Integer idCuidador) {
        return cuidadorRepository.findById(idCuidador)
                .map(this::toDTO);
    }

    public boolean crear(CuidadorDTO dto) {
        Cuidador entity = toEntity(dto);
        cuidadorRepository.save(entity);
        return true;
    }

    public boolean actualizar(Integer idCuidador, CuidadorDTO dto) {
        return cuidadorRepository.findById(idCuidador)
                .map(entity -> {
                    entity.setNombre(dto.getNombre());
                    entity.setApellido(dto.getApellido());
                    entity.setEspecialidad(dto.getEspecialidad());
                    entity.setTelefono(dto.getTelefono());
                    entity.setEmail(dto.getEmail());
                    entity.setDisponible(dto.isDisponible());
                    cuidadorRepository.save(entity);
                    return true;
                })
                .orElse(false);
    }

    public boolean eliminar(Integer idCuidador) {
        if (cuidadorRepository.existsById(idCuidador)) {
            cuidadorRepository.deleteById(idCuidador);
            return true;
        }
        return false;
    }

    private CuidadorDTO toDTO(Cuidador entity) {
        CuidadorDTO dto = new CuidadorDTO();
        dto.setIdCuidador(entity.getIdCuidador());
        dto.setNombre(entity.getNombre());
        dto.setApellido(entity.getApellido());
        dto.setEspecialidad(entity.getEspecialidad());
        dto.setTelefono(entity.getTelefono());
        dto.setEmail(entity.getEmail());
        dto.setDisponible(entity.isDisponible());
        return dto;
    }

    private Cuidador toEntity(CuidadorDTO dto) {
        Cuidador entity = new Cuidador();
        entity.setNombre(dto.getNombre());
        entity.setApellido(dto.getApellido());
        entity.setEspecialidad(dto.getEspecialidad());
        entity.setTelefono(dto.getTelefono());
        entity.setEmail(dto.getEmail());
        entity.setDisponible(dto.isDisponible());
        return entity;
    }
}
