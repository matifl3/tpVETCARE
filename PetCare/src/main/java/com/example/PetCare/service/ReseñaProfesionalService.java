package com.example.PetCare.service;

import com.example.PetCare.dto.ReseñaProfesionalDTO;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.ReseñaProfesional;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.ReseñaProfesionalRepository;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ReseñaProfesionalService {
    private final ReseñaProfesionalRepository reseñaProfesionalRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProfesionalRepository profesionalRepository;

    public ReseñaProfesionalService(ReseñaProfesionalRepository reseñaProfesionalRepository, UsuarioRepository usuarioRepository, ProfesionalRepository profesionalRepository) {
        this.reseñaProfesionalRepository = reseñaProfesionalRepository;
        this.usuarioRepository = usuarioRepository;
        this.profesionalRepository = profesionalRepository;
    }

    /// ABM
    public boolean alta(ReseñaProfesionalDTO dto){
        Usuario usuario =usuarioRepository.findById(dto.getId_usuario()).orElseThrow(()-> new NoEncontradoException("El usuario no existe"));
        Profesional profesional =profesionalRepository.findById(dto.getId_profesional()).orElseThrow(()-> new NoEncontradoException("El profesional no existe"));
        ReseñaProfesional entity=toEntity(dto,usuario,profesional);
        reseñaProfesionalRepository.save(entity);
        return true;
    }
    public boolean baja(Integer id){
        if(reseñaProfesionalRepository.existsById(id)){
            reseñaProfesionalRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public ReseñaProfesionalDTO actualizar(Integer id,ReseñaProfesionalDTO dto) {
        Usuario usuario =usuarioRepository.findById(dto.getId_usuario()).orElseThrow(()->new NoEncontradoException("El usuario no existe"));
        Profesional profesional =profesionalRepository.findById(dto.getId_profesional()).orElseThrow(()->new NoEncontradoException("El profesional no existe"));
        ReseñaProfesional reseñaProfesional=reseñaProfesionalRepository.findById(id).orElseThrow(()->new NoEncontradoException("La reseña no existe"));
        reseñaProfesional.setUsuario(usuario);
        reseñaProfesional.setProfesional(profesional);
        reseñaProfesional.setFecha(dto.getFecha());
        reseñaProfesional.setTexto(dto.getTexto());
        reseñaProfesional.setPuntuacion(dto.getPuntuacion());
        reseñaProfesional.setActivo(Boolean.TRUE.equals(dto.getActivo()));
        return toDTO(reseñaProfesionalRepository.save(reseñaProfesional));
    }
    // (Godoy) Lo mismo que en turnoService actualizar.

    /// Vista
    public List<ReseñaProfesionalDTO> listarTodos(){
        return reseñaProfesionalRepository.findAll()
                .stream().map(a -> toDTO(a))
                .toList();
    }

    public List<ReseñaProfesionalDTO> listarFechaBefore(LocalDate fecha){
        return reseñaProfesionalRepository.findByFechaBefore(fecha)
                .stream().map(a->toDTO(a))
                .toList();
    }

    public List<ReseñaProfesionalDTO> listarFechaAfter(LocalDate fecha){
        return reseñaProfesionalRepository.findByFechaAfter(fecha)
                .stream().map(a->toDTO(a))
                .toList();
    }

    public List<ReseñaProfesionalDTO> listarFechaMascota(LocalDate fecha){
        return reseñaProfesionalRepository.findByFecha(fecha)
                .stream().map(a->toDTO(a))
                .toList();
    }

    public List<ReseñaProfesionalDTO> listarPuntuacion(Integer puntuacion){
        return reseñaProfesionalRepository.findByPuntuacion(puntuacion)
                .stream().map(a->toDTO(a))
                .toList();
    }
    public List<ReseñaProfesionalDTO> listarActivos(Boolean activo){
        return reseñaProfesionalRepository.findByActivo(activo)
                .stream().map(a->toDTO(a))
                .toList();
    }

    /// aceptar o rechazar una reseña
    public boolean aprobarReseña(Integer id) {
        return reseñaProfesionalRepository.aprobarReseña(id) > 0;
    }

    public boolean desaprobarReseña(Integer id) {
        return reseñaProfesionalRepository.desaprobarReseña(id) > 0;
    }


    /// pasa de entidad a dto
    private ReseñaProfesionalDTO toDTO (ReseñaProfesional entity){
        ReseñaProfesionalDTO dto=new ReseñaProfesionalDTO();
        dto.setId(entity.getId());
        dto.setId_usuario(entity.getUsuario().getIdUsuario());
        dto.setId_profesional(entity.getProfesional().getIdUsuario());
        dto.setFecha(entity.getFecha());
        dto.setTexto(entity.getTexto());
        dto.setActivo(entity.isActivo());
        dto.setPuntuacion(entity.getPuntuacion());
        return dto;
    }
    /// pasa de dto a entidad
    private ReseñaProfesional toEntity(ReseñaProfesionalDTO dto, Usuario usuario, Profesional profesional){
        ReseñaProfesional entity=new ReseñaProfesional();
        entity.setId(dto.getId());
        entity.setUsuario(usuario);
        entity.setProfesional(profesional);
        entity.setFecha(dto.getFecha());
        entity.setTexto(dto.getTexto());
        entity.setPuntuacion(dto.getPuntuacion());
        entity.setActivo(Boolean.TRUE.equals(dto.getActivo()));
        return entity;
    }

}
