package com.example.PetCare.service;

import com.example.PetCare.dto.ReseñaProfesionalDTO;
import com.example.PetCare.dto.TurnoDTO;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.ReseñaProfesional;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.ReseñaProfesionalRepository;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
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
        Usuario usuario =usuarioRepository.findById(dto.getId_usuario()).orElse(null);
        Profesional profesional = profesionalRepository.findById(dto.getId_profesional()).orElse(null);
        if(profesional == null ||  usuario == null){
            return false;
        }
        ReseñaProfesional entity=toEntity(dto,profesional,usuario);
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
    /// *********
    public ReseñaProfesional actualizar(Integer id,ReseñaProfesionalDTO dto) {
        Usuario usuario =usuarioRepository.findById(dto.getId_usuario()).orElse(null);
        Profesional profesional = profesionalRepository.findById(dto.getId_profesional()).orElse(null);
        if(profesional == null ||  usuario == null){
            return null;
        }
        return reseñaProfesionalRepository.findById(id).map(a-> toEntity(dto,profesional,usuario)).orElse(null);
    }

    /// Vista
    public List<ReseñaProfesional> listarTodos(){
        return reseñaProfesionalRepository.findAll();
    }
    public List<ReseñaProfesionalDTO> listarFechaBefore(LocalDate fecha){
        return reseñaProfesionalRepository.findByFechaBefore(fecha).stream().map(a->toDTO(a)).toList();
    }

    public List<ReseñaProfesionalDTO> listarFechaAfter(LocalDate fecha){
        return reseñaProfesionalRepository.findByFechaAfter(fecha).stream().map(a->toDTO(a)).toList();
    }

    public List<ReseñaProfesionalDTO> listarFechaMascota(LocalDate fecha){
        return reseñaProfesionalRepository.findByFecha(fecha).stream().map(a->toDTO(a)).toList();
    }

    public List<ReseñaProfesionalDTO> listarPuntuacion(Integer puntuacion){
        return reseñaProfesionalRepository.findByPuntuacion(puntuacion).stream().map(a->toDTO(a)).toList();
    }
    public List<ReseñaProfesionalDTO> listarActivos(Boolean activo){
        return reseñaProfesionalRepository.findByActivo(activo).stream().map(a->toDTO(a)).toList();
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
        dto.setId_profesional(entity.getProfesional().getId());
        dto.setId_usuario(entity.getUsuario().getIdUsuario());
        dto.setFecha(entity.getFecha());
        dto.setTexto(entity.getTexto());
        dto.setActivo(entity.isActivo());
        dto.setPuntuacion(entity.getPuntuacion());
        return dto;
    }
    /// pasa de dto a entidad
    private ReseñaProfesional toEntity(ReseñaProfesionalDTO dto, Profesional profesional, Usuario usuario){
        ReseñaProfesional entity=new ReseñaProfesional();
        entity.setId(dto.getId());
        entity.setProfesional(profesional);
        entity.setUsuario(usuario);
        entity.setFecha(dto.getFecha());
        entity.setTexto(dto.getTexto());
        entity.setPuntuacion(dto.getPuntuacion());
        entity.setActivo(dto.isActivo());
        return entity;
    }

}
