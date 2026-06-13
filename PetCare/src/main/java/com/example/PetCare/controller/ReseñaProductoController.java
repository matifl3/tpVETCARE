package com.example.PetCare.controller;

import com.example.PetCare.dto.ReseñaProductoDTO;
import com.example.PetCare.model.ReseñaProducto;
import com.example.PetCare.service.ReseñaproductoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenas-productos")
public class ReseñaProductoController {

    private final ReseñaproductoService reseñaproductoService;

    public ReseñaProductoController(ReseñaproductoService reseñaproductoService) {
        this.reseñaproductoService = reseñaproductoService;
    }

    @GetMapping
    public List<ReseñaProductoDTO> listarTodos() {
        return reseñaproductoService.listaTodos();
    }

    @PostMapping
    public boolean crear(@RequestBody @Valid ReseñaProductoDTO dto) {
        return reseñaproductoService.alta(dto);
    }

    @PutMapping("/{id}")
    public ReseñaProductoDTO actualizar(@PathVariable Integer id, @RequestBody @Valid ReseñaProductoDTO dto) {
        return toReseñaProductoDTO(reseñaproductoService.actualizar(id, dto));
    }

    private ReseñaProductoDTO toReseñaProductoDTO(ReseñaProducto entity) {
        ReseñaProductoDTO dto = new ReseñaProductoDTO();
        dto.setId(entity.getId());
        dto.setComentario(entity.getComentario());
        dto.setActivo(entity.isActivo());
        dto.setFecha(entity.getFecha());
        dto.setPuntuacion(entity.getPuntuacion());
        dto.setId_usuario(entity.getUsuario().getIdUsuario());
        dto.setId_producto(entity.getProducto().getId());
        return dto;
    }

    @PutMapping("/{id}/aprobar")
    public boolean aprobarReseña(@PathVariable Integer id) {
        return reseñaproductoService.aprobarReseña(id);
    }

    @PutMapping("/{id}/desaprobar")
    public boolean desaprobarReseña(@PathVariable Integer id) {
        return reseñaproductoService.desaprobarReseña(id);
    }

    @DeleteMapping("/{id}")
    public boolean eliminar(@PathVariable Integer id) {
        return reseñaproductoService.baja(id);
    }
}
