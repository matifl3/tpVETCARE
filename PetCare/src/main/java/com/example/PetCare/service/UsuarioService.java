package com.example.PetCare.service;

import com.example.PetCare.dto.UsuarioDTO;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public Optional<UsuarioDTO> buscarPorId(Integer idUsuario) {
        return usuarioRepository.findById(idUsuario)
                .map(this::toDTO);
    }

    public boolean crear(UsuarioDTO dto) {
        Usuario entity = toEntity(dto);
        usuarioRepository.save(entity);
        return true;
    }

    public boolean actualizar(Integer idUsuario, UsuarioDTO dto) {
        return usuarioRepository.findById(idUsuario)
                .map(entity -> {
                    entity.setNombre(dto.getNombre());
                    entity.setApellido(dto.getApellido());
                    entity.setTelefono(dto.getTelefono());
                    entity.setEmail(dto.getEmail());
                    entity.setDireccion(dto.getDireccion());
                    usuarioRepository.save(entity);
                    return true;
                })
                .orElse(false);
    }

    public boolean eliminarLogico(Integer idUsuario) {
        if (usuarioRepository.existsById(idUsuario)) {
            usuarioRepository.deleteById(idUsuario);
            return true;
        }
        return false;
    }

    private UsuarioDTO toDTO(Usuario entity) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(entity.getIdUsuario());
        dto.setNombre(entity.getNombre());
        dto.setApellido(entity.getApellido());
        dto.setTelefono(entity.getTelefono());
        dto.setEmail(entity.getEmail());
        dto.setDireccion(entity.getDireccion());
        return dto;
    }

    private Usuario toEntity(UsuarioDTO dto) {
        Usuario entity = new Usuario();
        entity.setNombre(dto.getNombre());
        entity.setApellido(dto.getApellido());
        entity.setTelefono(dto.getTelefono());
        entity.setEmail(dto.getEmail());
        entity.setDireccion(dto.getDireccion());
        return entity;
    }
}
