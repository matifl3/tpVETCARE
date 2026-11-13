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

    // =========================================================================
    // CONSULTAS Y LISTADOS
    // =========================================================================    
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


    // =========================================================================
    // CREAR Y ACTUALIZAR PUBLICACIONES
    // =========================================================================
    public MascotaAdopcionDTO crearPublicacion(MascotaAdopcionDTO dto) {
        Mascota mascota = (dto.getIdMascota() != null)
            ? obtenerYValidarMascotaExistente(dto.getIdMascota())
            : crearNuevaMascota(dto);

        MascotaAdopcion publicacion = armarNuevaPublicacion(dto, mascota);
        MascotaAdopcion guardada = mascotaAdopcionRepository.save(publicacion);

        return toDTO(guardada);
    }

    
    private Mascota crearNuevaMascota(MascotaAdopcionDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().isBlank() ||
        dto.getEspecie() == null || dto.getEspecie().isBlank() ||
        dto.getSexo() == null || dto.getSexo().isBlank()) {
            throw new IllegalArgumentException("Para crear una mascota nueva, nombre, especie y sexo son obligatorios.");
        }
        
        Mascota nuevaMascota = new Mascota();
        nuevaMascota.setNombre(dto.getNombre());
        nuevaMascota.setEspecie(dto.getEspecie());
        nuevaMascota.setRaza(dto.getRaza());
        nuevaMascota.setSexo(dto.getSexo());
        nuevaMascota.setPeso(dto.getPeso() != null ? dto.getPeso() : 0.0);
        nuevaMascota.setFechaNacimiento(dto.getFechaNacimiento());
        nuevaMascota.setObservaciones(dto.getObservaciones());
        nuevaMascota.setActivo(true);
        nuevaMascota.setUsuario(null);
        
        HistorialClinico hc = new HistorialClinico();
        hc.setMascota(nuevaMascota);
        nuevaMascota.setHistorialClinico(hc);
        
        return mascotaRepository.save(nuevaMascota);
    }
    
    private MascotaAdopcion armarNuevaPublicacion(MascotaAdopcionDTO dto, Mascota mascota) {
        MascotaAdopcion publicacion = toEntity(dto, mascota);
        publicacion.setEstado(EstadoAdopcionMascota.DISPONIBLE);
        publicacion.setFechaPublicacion(LocalDate.now());
        return publicacion;
    }
    

    public MascotaAdopcionDTO actualizarPublicacion(Integer idMascotaAdopcion, MascotaAdopcionDTO dto) {
        MascotaAdopcion publicacionExistente = obtenerPublicacion(idMascotaAdopcion);
        
        if (publicacionExistente.getEstado() == EstadoAdopcionMascota.ADOPTADA) {
            throw new IllegalStateException("No se puede editar una publicación que ya figura como ADOPTADA.");
        }

        publicacionExistente.setTamanio(dto.getTamanio());
        publicacionExistente.setFoto(dto.getFoto());
        publicacionExistente.setDescripcion(dto.getDescripcion());
        publicacionExistente.setCastrado(dto.isCastrado());
        publicacionExistente.setDesparasitado(dto.isDesparasitado());
        
        MascotaAdopcion actualizada = mascotaAdopcionRepository.save(publicacionExistente);
        return toDTO(actualizada);
    }
    
    
    // =========================================================================
    // GESTIÓN DE ESTADOS DE PUBLICACIÓN
    // =========================================================================
    public void pausarPublicacion(Integer idMascotaAdopcion) {
        MascotaAdopcion publicacion = obtenerPublicacionEnEstado(
            idMascotaAdopcion,
            EstadoAdopcionMascota.DISPONIBLE,
            "Solo se pueden pausar publicaciones que estén en estado DISPONIBLE."
        );
        
        publicacion.setEstado(EstadoAdopcionMascota.PAUSADA);
        mascotaAdopcionRepository.save(publicacion);
    }
    
    
    public void reanudarPublicacionPausada(Integer idMascotaAdopcion) {
        MascotaAdopcion publicacion = obtenerPublicacionEnEstado(
            idMascotaAdopcion,
            EstadoAdopcionMascota.PAUSADA,
            "Solo se pueden reanudar publicaciones que estén en estado PAUSADA."
        );
        validarMascotaActiva(publicacion);

        publicacion.setEstado(EstadoAdopcionMascota.DISPONIBLE);
        mascotaAdopcionRepository.save(publicacion);
    }

    
    public void republicarPublicacionAdoptada(Integer idMascotaAdopcion) {
        MascotaAdopcion publicacion = obtenerPublicacionEnEstado(
            idMascotaAdopcion,
            EstadoAdopcionMascota.ADOPTADA,
            "Solo se pueden republicar publicaciones que estén en estado ADOPTADA."
        );
        validarMascotaActiva(publicacion);

        publicacion.setEstado(EstadoAdopcionMascota.DISPONIBLE);
        publicacion.getMascota().setUsuario(null);
        mascotaAdopcionRepository.save(publicacion);
    }
    
    
    public void darEnAdopcion(Integer idMascotaAdopcion, Usuario usuarioAdoptante) {
        if (usuarioAdoptante == null) {
            throw new IllegalArgumentException("El usuario adoptante no puede ser nulo.");
        }
        
        MascotaAdopcion publicacion = obtenerPublicacionEnEstado(
            idMascotaAdopcion,
            EstadoAdopcionMascota.DISPONIBLE,
            "Solo se pueden dar en adopción publicaciones que estén en estado DISPONIBLE."
        );
        validarMascotaActiva(publicacion);
        
        publicacion.setEstado(EstadoAdopcionMascota.ADOPTADA);
        publicacion.getMascota().setUsuario(usuarioAdoptante);
        mascotaAdopcionRepository.save(publicacion);
    }

    
    // =========================================================================
    // MÉTODOS AUXILIARES Y VALIDACIONES INTERNAS
    // =========================================================================
    private Mascota obtenerYValidarMascotaExistente(Integer idMascota) {
        Mascota mascota = mascotaRepository.findById(idMascota)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró la mascota con ID: " + idMascota));

        if (!mascota.isActivo()) {
            throw new IllegalStateException("La mascota seleccionada está dada de baja.");
        }
        if (mascota.getUsuario() != null) {
            throw new IllegalStateException("No se puede publicar una mascota que ya pertenece a un cliente.");
        }
        if (mascotaAdopcionRepository.existsByMascotaIdMascota(mascota.getIdMascota())) {
            throw new IllegalStateException("Esta mascota ya tiene una publicación de adopción asociada.");
        }

        return mascota;
    }

    private MascotaAdopcion obtenerPublicacion(Integer idMascotaAdopcion) {
        return mascotaAdopcionRepository.findById(idMascotaAdopcion)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró la publicación con ID: " + idMascotaAdopcion));
    }
            
    private MascotaAdopcion obtenerPublicacionEnEstado(Integer idMascotaAdopcion, EstadoAdopcionMascota estadoEsperado, String mensajeError) {
        MascotaAdopcion publicacion = obtenerPublicacion(idMascotaAdopcion);
        if (publicacion.getEstado() != estadoEsperado) {
            throw new IllegalStateException(mensajeError);
        }
        return publicacion;
    }

    private void validarMascotaActiva(MascotaAdopcion publicacion) {
        if (!publicacion.getMascota().isActivo()) {
            throw new IllegalStateException("La mascota asociada está dada de baja.");
        }
    }

    

    // =========================================================================
    // MAPPERS (ENTIDAD <-> DTO)
    // =========================================================================
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