package com.example.PetCare.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.PetCare.dto.MascotaAdopcionDTO;
import com.example.PetCare.enums.EstadoAdopcionMascota;
import com.example.PetCare.model.HistorialClinico;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.MascotaAdopcion;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.MascotaAdopcionRepository;
import com.example.PetCare.repository.MascotaRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service 
@Transactional 
public class MascotaAdopcionService {
    private final MascotaAdopcionRepository mascotaAdopcionRepository;
    private final MascotaRepository mascotaRepository;

    public MascotaAdopcionService(MascotaAdopcionRepository mascotaAdopcionRepository, MascotaRepository mascotaRepository) {
        this.mascotaAdopcionRepository = mascotaAdopcionRepository;
        this.mascotaRepository = mascotaRepository;
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


    public List<MascotaAdopcionDTO> listarMascotasElegibles() {
        return mascotaRepository.findMascotasElegiblesParaAdopcion().stream()
                .map(this::mascotaToAdopcionDTO)
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


    ///ABM
    public MascotaAdopcionDTO crearPublicacion(MascotaAdopcionDTO dto) {
        Mascota mascota;

        if (dto.getIdMascota() != null) {
            mascota = mascotaRepository.findById(dto.getIdMascota())
                    .orElseThrow(() -> new EntityNotFoundException("No se encontró la mascota con ID: " + dto.getIdMascota()));

            if (!mascota.isActivo()) {
                throw new IllegalStateException("La mascota seleccionada está dada de baja.");
            }
            if (mascota.getUsuario() != null) {
                throw new IllegalStateException("No se puede publicar una mascota que ya pertenece a un cliente.");
            }
            if (mascotaAdopcionRepository.existsByMascotaIdMascota(mascota.getIdMascota())) {
                throw new IllegalStateException("Esta mascota ya tiene una publicación de adopción asociada.");
            }
        } else {

            Mascota nuevaMascota = new Mascota();
            nuevaMascota.setNombre(dto.getNombre());
            nuevaMascota.setEspecie(dto.getEspecie());
            nuevaMascota.setRaza(dto.getRaza());
            nuevaMascota.setSexo(dto.getSexo());
            nuevaMascota.setPeso(dto.getPeso());
            nuevaMascota.setFechaNacimiento(dto.getFechaNacimiento());
            nuevaMascota.setObservaciones(dto.getObservaciones());
            nuevaMascota.setActivo(true);
            nuevaMascota.setUsuario(null);

            HistorialClinico hc = new HistorialClinico(); 
            hc.setMascota(nuevaMascota); 
            nuevaMascota.setHistorialClinico(hc);

            mascota = mascotaRepository.save(nuevaMascota);
        }

        MascotaAdopcion publicacion = new MascotaAdopcion();
        publicacion.setTamanio(dto.getTamanio());
        publicacion.setFoto(dto.getFoto());
        publicacion.setDescripcion(dto.getDescripcion());
        publicacion.setCastrado(dto.isCastrado());
        publicacion.setDesparasitado(dto.isDesparasitado());
        publicacion.setEstado(EstadoAdopcionMascota.DISPONIBLE);
        publicacion.setFechaPublicacion(LocalDate.now());
        publicacion.setMascota(mascota);

        MascotaAdopcion guardada = mascotaAdopcionRepository.save(publicacion);
        return toDTO(guardada);
    }
    

    public MascotaAdopcionDTO actualizarPublicacion(Integer idMascotaAdopcion, MascotaAdopcionDTO dto) {
        MascotaAdopcion publicacionExistente = mascotaAdopcionRepository.findById(idMascotaAdopcion)
        .orElseThrow(() -> new EntityNotFoundException("No se encontró la publicación con ID: " + idMascotaAdopcion));

        publicacionExistente.setTamanio(dto.getTamanio());
        publicacionExistente.setFoto(dto.getFoto());
        publicacionExistente.setDescripcion(dto.getDescripcion());
        publicacionExistente.setCastrado(dto.isCastrado());
        publicacionExistente.setDesparasitado(dto.isDesparasitado());
        
        MascotaAdopcion actualizada = mascotaAdopcionRepository.save(publicacionExistente);
        return toDTO(actualizada);
    }


    public void pausarPublicacion(Integer idMascotaAdopcion) {
        MascotaAdopcion publicacionExistente = mascotaAdopcionRepository.findById(idMascotaAdopcion)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró la publicación con ID: " + idMascotaAdopcion));
                
        if(publicacionExistente.getEstado() != EstadoAdopcionMascota.DISPONIBLE) {
            throw new IllegalStateException("Solo se pueden pausar publicaciones que estén en estado DISPONIBLE.");
        }
        
        publicacionExistente.setEstado(EstadoAdopcionMascota.PAUSADA);
        mascotaAdopcionRepository.save(publicacionExistente);
    }
    
    
    public void reanudarPublicacionPausada(Integer idMascotaAdopcion) {
        MascotaAdopcion publicacionExistente = mascotaAdopcionRepository.findById(idMascotaAdopcion)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró la publicación con ID: " + idMascotaAdopcion));
                
        if(publicacionExistente.getEstado() != EstadoAdopcionMascota.PAUSADA) {
            throw new IllegalStateException("Solo se pueden reanudar publicaciones que estén en estado PAUSADA.");
        }
        
        publicacionExistente.setEstado(EstadoAdopcionMascota.DISPONIBLE);
        mascotaAdopcionRepository.save(publicacionExistente);
    }


    public void reanudarPublicacionAdoptada(Integer idMascotaAdopcion) {
        MascotaAdopcion publicacionExistente = mascotaAdopcionRepository.findById(idMascotaAdopcion)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró la publicación con ID: " + idMascotaAdopcion));
                
        if(publicacionExistente.getEstado() != EstadoAdopcionMascota.ADOPTADA) {
            throw new IllegalStateException("Solo se pueden reanudar publicaciones que estén en estado ADOPTADA.");
        }

        publicacionExistente.setEstado(EstadoAdopcionMascota.DISPONIBLE);
        publicacionExistente.getMascota().setUsuario(null);
        mascotaAdopcionRepository.save(publicacionExistente);
    }
    

    public void darEnAdopcion(Integer idMascotaAdopcion, Usuario usuarioAdoptante) {
        MascotaAdopcion publicacionExistente = mascotaAdopcionRepository.findById(idMascotaAdopcion)
        .orElseThrow(() -> new EntityNotFoundException("No se encontró la publicación con ID: " + idMascotaAdopcion));

        if(publicacionExistente.getEstado() != EstadoAdopcionMascota.DISPONIBLE) {
            throw new IllegalStateException("Solo se pueden dar en adopción publicaciones que estén en estado DISPONIBLE.");
        }
        if(usuarioAdoptante == null) {
            throw new IllegalArgumentException("El usuario adoptante no puede ser nulo.");
        }
        if(publicacionExistente.getMascota().isActivo() == false) {
            throw new IllegalStateException("No se puede dar en adopción una mascota que está dada de baja.");
        }
        publicacionExistente.setEstado(EstadoAdopcionMascota.ADOPTADA);
        publicacionExistente.getMascota().setUsuario(usuarioAdoptante);
        mascotaAdopcionRepository.save(publicacionExistente);
    }


    /// pasa de entidad a dto
    public MascotaAdopcionDTO toDTO(MascotaAdopcion entidad) {
        Mascota m = entidad.getMascota();
        MascotaAdopcionDTO dto = new MascotaAdopcionDTO();

        dto.setIdMascotaAdopcion(entidad.getIdMascotaAdopcion());
        dto.setIdMascota(m.getIdMascota());
        dto.setNombre(m.getNombre());
        dto.setEspecie(m.getEspecie());
        dto.setRaza(m.getRaza());
        dto.setSexo(m.getSexo());
        dto.setPeso(m.getPeso());
        dto.setFechaNacimiento(m.getFechaNacimiento());
        dto.setObservaciones(m.getObservaciones());
        
        dto.setTamanio(entidad.getTamanio());
        dto.setFoto(entidad.getFoto());
        dto.setDescripcion(entidad.getDescripcion());
        dto.setCastrado(entidad.isCastrado());
        dto.setDesparasitado(entidad.isDesparasitado());
        dto.setEstado(entidad.getEstado());
        dto.setFechaPublicacion(entidad.getFechaPublicacion());

        if (m.getHistorialClinico() != null && m.getHistorialClinico().getVacunas() != null) {
            dto.setVacunas(m.getHistorialClinico().getVacunas());
        } else {
            dto.setVacunas(List.of());
        }

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

    //pasa de mascota a adopcion dto
    private MascotaAdopcionDTO mascotaToAdopcionDTO(Mascota m) {
        MascotaAdopcionDTO dto = new MascotaAdopcionDTO();
        dto.setIdMascota(m.getIdMascota());
        dto.setNombre(m.getNombre());
        dto.setEspecie(m.getEspecie());
        dto.setRaza(m.getRaza());
        dto.setSexo(m.getSexo());
        dto.setPeso(m.getPeso());
        dto.setFechaNacimiento(m.getFechaNacimiento());
        dto.setObservaciones(m.getObservaciones());
        return dto;
    }
}