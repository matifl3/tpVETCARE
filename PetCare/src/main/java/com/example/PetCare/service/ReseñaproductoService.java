package com.example.PetCare.service;

import com.example.PetCare.dto.ReseñaProductoDTO;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.*;
import com.example.PetCare.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReseñaproductoService {
    private final ReseñaProductoRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public ReseñaproductoService(ReseñaProductoRepository repository, UsuarioRepository usuarioRepository, ProductoRepository productoRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    public List<ReseñaProductoDTO>listaTodos(){
        return repository.findAll().stream().map(a-> toDTO(a)).toList();
    }

    public boolean alta(ReseñaProductoDTO dto){
        Usuario usuario =usuarioRepository.findById(dto.getId_usuario()).orElseThrow(()->new NoEncontradoException("El usuario no existe"));
        Producto producto=productoRepository.findById(dto.getId_producto()).orElseThrow(()->new NoEncontradoException("El producto no se encuentra"));
        ReseñaProducto entity=toEntity(dto,producto,usuario);
        repository.save(entity);
        return true;
    }

    public boolean baja(Integer id){
        if(repository.existsById(id)){
            repository.deleteById(id);
            return true;
        }
        return false;
    }
    public ReseñaProductoDTO actualizar(Integer id,ReseñaProductoDTO dto) {
        Usuario usuario =usuarioRepository.findById(dto.getId_usuario()).orElseThrow(()->new NoEncontradoException("El usuario no existe"));
        Producto producto = productoRepository.findById(dto.getId_producto()).orElseThrow(()->new NoEncontradoException("El producto no existe"));
        ReseñaProducto reseñaProducto= repository.findById(id).orElseThrow(()->new NoEncontradoException("La reseña no existe"));
        reseñaProducto.setUsuario(usuario);
        reseñaProducto.setProducto(producto);
        reseñaProducto.setComentario(dto.getComentario());
        reseñaProducto.setPuntuacion(dto.getPuntuacion());
        reseñaProducto.setFecha(dto.getFecha());
        reseñaProducto.setActivo(Boolean.TRUE.equals(dto.getActivo()));
        return toDTO(repository.save(reseñaProducto));
    }
    // (Godoy) Lo mismo que en turnoService actualizar.

    public boolean aprobarReseña(Integer id) {
        return repository.aprobarReseña(id) > 0;
    }

    public boolean desaprobarReseña(Integer id) {
        return repository.desaprobarReseña(id) > 0;
    }

    /// pasa de entidad a dto
    private ReseñaProductoDTO toDTO (ReseñaProducto entity){
        ReseñaProductoDTO dto=new ReseñaProductoDTO();
        dto.setId(entity.getId());
        dto.setComentario(entity.getComentario());
        dto.setActivo(entity.isActivo());
        dto.setFecha(entity.getFecha());
        dto.setPuntuacion(entity.getPuntuacion());
        dto.setId_usuario(entity.getUsuario().getIdUsuario());
        dto.setId_producto(entity.getProducto().getId());
        return dto;
    }
    /// pasa de dto a entidad
    private ReseñaProducto toEntity(ReseñaProductoDTO dto, Producto producto, Usuario usuario){
        ReseñaProducto entity=new ReseñaProducto();
        entity.setId(dto.getId());
        entity.setActivo(Boolean.TRUE.equals(dto.getActivo()));
        entity.setComentario(dto.getComentario());
        entity.setPuntuacion(dto.getPuntuacion());
        entity.setFecha(dto.getFecha());
        entity.setProducto(producto);
        entity.setUsuario(usuario);
        return entity;
    }


}
