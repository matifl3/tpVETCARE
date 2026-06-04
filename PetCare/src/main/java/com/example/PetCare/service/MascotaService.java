package com.example.PetCare.service;

import com.example.PetCare.dto.MascotaDTO;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
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

    public List<Mascota> buscarPorEspecie(String especie) {
        return mascotaRepository.findByEspecieAndActivoTrue(especie);
    }
    public List<Mascota> buscarPorRaza(String raza) {
        return mascotaRepository.findByRazaAndActivoTrue(raza);
    }
    public List<Mascota> buscarPorNombre(String nombre) {
        return mascotaRepository.findByNombreAndActivoTrue(nombre);
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
                    entity.setActivo(dto.isActivo());
                    entity.setObservaciones(dto.getObservaciones());
                    entity.setSexo(dto.getSexo());
                    entity.setFecha_nacimiento(dto.getFecha_nacimiento());
                    entity.setPeso(dto.getPeso());
                    entity.setUsuario(usuario);
                    mascotaRepository.save(entity);
                    return true;
                })
                .orElse(false);
    }

    public boolean eliminar(Integer idMascota) {
        if (mascotaRepository.existsById(idMascota)) {
            mascotaRepository.deleteById(idMascota);
            return true;
        }
        return false;
    }
 /// pasa de dto a entidad
    private MascotaDTO toDTO(Mascota entity) {
        MascotaDTO dto = new MascotaDTO();
        dto.setIdMascota(entity.getIdMascota());
        dto.setNombre(entity.getNombre());
        dto.setEspecie(entity.getEspecie());
        dto.setRaza(entity.getRaza());
        dto.setActivo(entity.isActivo());
        dto.setObservaciones(entity.getObservaciones());
        dto.setSexo(entity.getSexo());
        dto.setFecha_nacimiento(entity.getFecha_nacimiento());
        dto.setPeso(entity.getPeso());
        dto.setIdUsuario(entity.getUsuario().getIdUsuario());
        return dto;
    }
    /// pasa de entidad a dto
    private Mascota toEntity(MascotaDTO dto, Usuario usuario) {
        Mascota entity = new Mascota();
        entity.setNombre(dto.getNombre());
        entity.setEspecie(dto.getEspecie());
        entity.setRaza(dto.getRaza());
        entity.setFecha_nacimiento(dto.getFecha_nacimiento());
        entity.setSexo(dto.getSexo());
        entity.setObservaciones(dto.getObservaciones());
        entity.setActivo(dto.isActivo());
        entity.setPeso(dto.getPeso());
        entity.setUsuario(usuario);
        return entity;
    }
}
