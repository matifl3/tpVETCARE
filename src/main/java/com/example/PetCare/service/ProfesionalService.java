package com.example.PetCare.service;

import com.example.PetCare.dto.ProfesionalDTO;
import com.example.PetCare.enums.EstadoProfesional;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.repository.ProfesionalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
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
        existente.setIdUsuario(id);
        return profesionalRepository.save(existente);
    }

    public void eliminar (int id){
        profesionalRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("El profesional no fue encontrado"));
        profesionalRepository.deleteById(id);
    }

    public List<ProfesionalDTO> listarTodosDTO(){
        return profesionalRepository.findAll()
                .stream()
                .filter(p -> p.getEstado() == EstadoProfesional.APROBADO)
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
                .filter(p -> p.getEstado() == EstadoProfesional.APROBADO)
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

    // ==================== MÉTODOS DE APROBACIÓN ====================

    /**
     * Lista todos los profesionales que están en estado PENDIENTE.
     * Estos son los que se registraron y esperan que un admin los revise.
     */
    public List<ProfesionalDTO> buscarPendientes() {
        return profesionalRepository.findByEstado(EstadoProfesional.PENDIENTE)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    /**
     * Lista todos los profesionales en un estado específico (PENDIENTE, APROBADO, RECHAZADO).
     */
    public List<ProfesionalDTO> buscarPorEstado(EstadoProfesional estado) {
        return profesionalRepository.findByEstado(estado)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    /**
     * Aprueba un profesional: cambia su estado a APROBADO y lo activa.
     * Una vez aprobado, el profesional puede ofrecer servicios en el sistema.
     *
     * @param id ID del profesional a aprobar
     * @return true si se aprobó correctamente
     */
    public boolean aprobar(int id) {
        Profesional profesional = profesionalRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("El profesional no fue encontrado"));

        if (profesional.getEstado() == EstadoProfesional.APROBADO) {
            return true;
        }

        return profesionalRepository.actualizarEstado(id, EstadoProfesional.APROBADO, true) > 0;
    }

    /**
     * Rechaza un profesional: cambia su estado a RECHAZADO y lo desactiva.
     * Un profesional rechazado no puede ofrecer servicios en el sistema.
     *
     * @param id ID del profesional a rechazar
     * @return true si se rechazó correctamente
     */
    public boolean rechazar(int id) {
        Profesional profesional = profesionalRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("El profesional no fue encontrado"));

        if (profesional.getEstado() == EstadoProfesional.RECHAZADO) {
            return true;
        }

        return profesionalRepository.actualizarEstado(id, EstadoProfesional.RECHAZADO, false) > 0;
    }

    /**
     * Convierte una entidad Profesional a su DTO correspondiente.
     * Incluye el campo estado para que el frontend pueda mostrar el estado de aprobación.
     */
    public ProfesionalDTO toDTO(Profesional p){
        ProfesionalDTO dto = new ProfesionalDTO();
        dto.setId(p.getIdUsuario());
        dto.setNombre(p.getNombre());
        dto.setApellido(p.getApellido());
        dto.setEmail(p.getEmail());
        dto.setTelefono(p.getTelefono());
        dto.setRol(p.getRol());
        dto.setActivo(p.getActivo());
        dto.setMatricula(p.getMatricula());
        dto.setExperiencia(p.getExperiencia());
        dto.setEstado(p.getEstado());
        double[] precios = calcularPrecios(p.getRol());
        dto.setPrecioBase(precios[0]);
        dto.setPrecioHora(precios[1]);
        return dto;
    }

    public static double[] calcularPrecios(Rol rol) {
        double precioBase = switch (rol) {
            case VETERINARIO -> 5000.0;
            case PASEADOR -> 3000.0;
            case PELUQUERO -> 4000.0;
            case ADIESTRADOR -> 4500.0;
            case CUIDADOR -> 2500.0;
            default -> 3000.0;
        };
        double precioHora = (rol == Rol.PASEADOR || rol == Rol.CUIDADOR) ? 1500.0 : 0.0;
        return new double[]{precioBase, precioHora};
    }
}
