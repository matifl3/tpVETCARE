package com.example.PetCare.service;

import com.example.PetCare.dto.ProfesionalDTO;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.repository.ProfesionalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfesionalService {
    private final ProfesionalRepository profesionalRepository;

    public ProfesionalService(ProfesionalRepository profesionalRepository) {
        this.profesionalRepository = profesionalRepository;
    }

    public Profesional crear (Profesional profesional){
        return profesionalRepository.save(profesional);
    }

    public Profesional actualizar(int id, Profesional profesional){
        Profesional existente = profesionalRepository.findById(profesional.getIdUsuario())
                .orElseThrow(() -> new NoEncontradoException("El profesional no fue encontrado"));
        profesional.setIdUsuario(id);
        return profesionalRepository.save(profesional);
    }

    public void eliminar (int id){
        profesionalRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("El profesional no fue encontrado"));
        profesionalRepository.deleteById(id);
    }

    public List<ProfesionalDTO> listarTodosDTO(){
        return profesionalRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public Optional<ProfesionalDTO> buscarPorId(int id){
        return profesionalRepository.findById(id)
                .map(this::toDTO);
    }

    public List<ProfesionalDTO> buscarPorRol(Rol rol){
        return profesionalRepository.findByRol(rol)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<ProfesionalDTO> buscarPorApellido(String apellido){
        return profesionalRepository.findByApellidoContainingIgnoreCase(apellido)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public Optional<ProfesionalDTO> buscarPorMatricula(String matricula){
        return profesionalRepository.findByMatricula(matricula)
                .map(this::toDTO);
    }

    public ProfesionalDTO toDTO(Profesional p){
        ProfesionalDTO dto = new ProfesionalDTO();
        dto.setId(p.getId());
        dto.setNombre(p.getNombre());
        dto.setApellido(p.getApellido());
        dto.setEmail(p.getEmail());
        dto.setTelefono(p.getTelefono());
        dto.setRol(p.getRol());
        dto.setActivo(p.isActivo());
        dto.setMatricula(p.getMatricula());
        dto.setExperiencia(p.getExperiencia());
        return dto;
    }
}
