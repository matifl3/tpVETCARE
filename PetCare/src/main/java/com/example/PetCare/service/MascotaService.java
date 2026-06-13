package com.example.PetCare.service;

import com.example.PetCare.dto.MascotaDTO;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MascotaService {

    private final MascotaRepository mascotaRepository;
    private final UsuarioRepository usuarioRepository;

    public MascotaService(MascotaRepository mascotaRepository, UsuarioRepository usuarioRepository) {
        this.mascotaRepository = mascotaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /// listados
    public List<MascotaDTO> listarTodos() {
        return mascotaRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public Optional<MascotaDTO> buscarPorId(Integer idMascota) {
        return mascotaRepository.findById(idMascota)
                .map(this::toDTO);
    }

    public List<MascotaDTO> buscarPorEspecie(String especie) {
        return mascotaRepository.findByEspecieAndActivoTrue(especie).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MascotaDTO> buscarPorRaza(String raza) {
        return mascotaRepository.findByRazaAndActivoTrue(raza).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MascotaDTO> buscarPorNombre(String nombre) {
        return mascotaRepository.findByNombreAndActivoTrue(nombre).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MascotaDTO> buscaMascotasAtendidasPorProfesional(int id) {
        return mascotaRepository.findMascotasAtendidasPorProfesional(id).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MascotaDTO> masotaAtendidaXnombre(int id, String nombre) {
        return mascotaRepository.findMascotasAtendidasPorProfesional(id).stream()
                .map(this::toDTO)
                .filter(a -> a.getNombre().equals(nombre))
                .toList();
    }

    /// ABM
    public boolean crear(MascotaDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario()).orElse(null);
        if (usuario == null) {
            return false;
        }
        Mascota entity = toEntity(dto, usuario);
        mascotaRepository.save(entity);
        return true;
    }

    public boolean actualizar(Integer idMascota, MascotaDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario()).orElse(null);
        if (usuario == null) {
            return false;
        }
        return mascotaRepository.findById(idMascota)
                .map(entity -> {
                    entity.setNombre(dto.getNombre());
                    entity.setEspecie(dto.getEspecie());
                    entity.setRaza(dto.getRaza());
                    entity.setActivo(Boolean.TRUE.equals(dto.getActivo()));
                    entity.setObservaciones(dto.getObservaciones());
                    entity.setSexo(dto.getSexo());
                    entity.setFechaNacimiento(dto.getFechaNacimiento());
                    entity.setPeso(dto.getPeso());
                    entity.setUsuario(usuario);
                    mascotaRepository.save(entity);
                    return true;
                })
                .orElse(false);
    }

    public MascotaDTO actualizarObservacion(Integer id, String observacion) {
        Mascota mascota = mascotaRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("Mascota no encontrada"));
        mascota.setObservaciones(observacion);
        return toDTO(mascotaRepository.save(mascota));
    }

    public boolean eliminar(Integer idMascota) {
        if (mascotaRepository.existsById(idMascota)) {
            mascotaRepository.deleteById(idMascota);
            return true;
        }
        return false;
    }

    /// pasa de dto a entidad
    public MascotaDTO toDTO(Mascota entity) {
        MascotaDTO dto = new MascotaDTO();
        dto.setIdMascota(entity.getIdMascota());
        dto.setNombre(entity.getNombre());
        dto.setEspecie(entity.getEspecie());
        dto.setRaza(entity.getRaza());
        dto.setActivo(entity.isActivo());
        dto.setObservaciones(entity.getObservaciones());
        dto.setSexo(entity.getSexo());
        dto.setFechaNacimiento(entity.getFechaNacimiento());
        dto.setPeso(entity.getPeso());
        dto.setIdUsuario(entity.getUsuario().getIdUsuario());
        return dto;
    }

    /// pasa de entidad a dto
    public Mascota toEntity(MascotaDTO dto, Usuario usuario) {
        Mascota entity = new Mascota();
        entity.setNombre(dto.getNombre());
        entity.setEspecie(dto.getEspecie());
        entity.setRaza(dto.getRaza());
        entity.setFechaNacimiento(dto.getFechaNacimiento());
        entity.setSexo(dto.getSexo());
        entity.setObservaciones(dto.getObservaciones());
        entity.setActivo(dto.getActivo());
        entity.setPeso(dto.getPeso());
        entity.setUsuario(usuario);
        return entity;
    }
}
