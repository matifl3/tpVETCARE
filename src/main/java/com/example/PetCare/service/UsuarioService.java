package com.example.PetCare.service;

import com.example.PetCare.dto.UsuarioDTO;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    // PasswordEncoder: hashea las contraseñas con bcrypt
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
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

    public List<UsuarioDTO> buscarPorRol(Rol rol) {
        return usuarioRepository.findByRol(rol).stream()
                .map(this::toDTO)
                .toList();
    }

    public UsuarioDTO crear(UsuarioDTO dto) {
        Usuario entity = toEntity(dto);
        return toDTO(usuarioRepository.save(entity));
    }

    public List<UsuarioDTO> findByNombre(String nombre) {
        return usuarioRepository.findByNombre(nombre).stream()
                .map(this::toDTO)
                .toList();
    }

    public Optional<UsuarioDTO> findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .map(this::toDTO);
    }

    public List<UsuarioDTO> findByTelefono(String telefono) {
        return usuarioRepository.findByTelefono(telefono).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<UsuarioDTO> findByDireccion(String direccion) {
        return usuarioRepository.findByDireccion(direccion).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<UsuarioDTO> findByActivo(boolean activo) {
        return usuarioRepository.findByActivo(activo).stream()
                .map(this::toDTO)
                .toList();
    }

    public UsuarioDTO actualizar(UsuarioDTO dto) {
        Usuario usu = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new NoEncontradoException("Usuario no encontrado"));
        usu.setNombre(dto.getNombre());
        usu.setApellido(dto.getApellido());
        usu.setEmail(dto.getEmail());
        usu.setTelefono(dto.getTelefono());
        usu.setDireccion(dto.getDireccion());
        usu.setActivo(dto.getActivo());
        return toDTO(usuarioRepository.save(usu));
    }

    public boolean eliminar(Integer idUsuario) {
        if (usuarioRepository.existsById(idUsuario)) {
            usuarioRepository.deleteById(idUsuario);
            return true;
        }
        return false;
    }

    // ==================== RESTABLECER CONTRASEÑA ====================

    /**
     * Restablece la contraseña de un usuario.
     * El admin envía la nueva contraseña y el sistema la actualiza en la entidad JPA.
     *
     * @param idUsuario ID del usuario cuya contraseña se va a cambiar
     * @param nuevaPassword La nueva contraseña en texto plano (se hasheará con bcrypt)
     */
    public void resetPassword(int idUsuario, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new NoEncontradoException("Usuario no encontrado"));

        String hash = passwordEncoder.encode(nuevaPassword);
        usuario.setPassword(hash);
        usuarioRepository.save(usuario);
    }

    public UsuarioDTO toDTO(Usuario entity) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(entity.getIdUsuario());
        dto.setNombre(entity.getNombre());
        dto.setApellido(entity.getApellido());
        dto.setEmail(entity.getEmail());
        dto.setTelefono(entity.getTelefono());
        dto.setDireccion(entity.getDireccion());
        dto.setRol(entity.getRol());
        dto.setActivo(entity.getActivo());
        return dto;
    }

    private Usuario toEntity(UsuarioDTO dto) {
        Usuario entity = new Usuario();
        entity.setIdUsuario(dto.getIdUsuario());
        entity.setNombre(dto.getNombre());
        entity.setApellido(dto.getApellido());
        entity.setEmail(dto.getEmail());
        entity.setTelefono(dto.getTelefono());
        entity.setDireccion(dto.getDireccion());
        entity.setRol(dto.getRol());
        entity.setActivo(dto.getActivo());
        return entity;
    }
}
