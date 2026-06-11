package com.example.PetCare.controller;

import com.example.PetCare.dto.ReseñaProductoDTO;
import com.example.PetCare.model.ReseñaProducto;
import com.example.PetCare.service.ReseñaproductoService;
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
    public boolean crear(@RequestBody ReseñaProductoDTO dto) {
        return reseñaproductoService.alta(dto);
    }

    @PutMapping("/{id}")
    public ReseñaProducto actualizar(@PathVariable Integer id, @RequestBody ReseñaProductoDTO dto) {
        return reseñaproductoService.actualizar(id, dto);
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
