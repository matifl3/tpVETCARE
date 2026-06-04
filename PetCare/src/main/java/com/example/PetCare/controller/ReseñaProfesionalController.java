package com.example.PetCare.controller;

import com.example.PetCare.dto.ReseñaProfesionalDTO;
import com.example.PetCare.model.ReseñaProfesional;
import com.example.PetCare.service.ReseñaProfesionalService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/resenas")
public class ReseñaProfesionalController {

    private final ReseñaProfesionalService reseñaProfesionalService;

    public ReseñaProfesionalController(ReseñaProfesionalService reseñaProfesionalService) {
        this.reseñaProfesionalService = reseñaProfesionalService;
    }

    @GetMapping
    public List<ReseñaProfesional> listarTodos() {
        return reseñaProfesionalService.listarTodos();
    }

    @GetMapping("/fecha/antes/{fecha}")
    public List<ReseñaProfesionalDTO> listarAntesDe(@PathVariable LocalDate fecha) {
        return reseñaProfesionalService.listarFechaBefore(fecha);
    }

    @GetMapping("/fecha/despues/{fecha}")
    public List<ReseñaProfesionalDTO> listarDespuesDe(@PathVariable LocalDate fecha) {
        return reseñaProfesionalService.listarFechaAfter(fecha);
    }

    @GetMapping("/fecha/{fecha}")
    public List<ReseñaProfesionalDTO> listarPorFecha(@PathVariable LocalDate fecha) {
        return reseñaProfesionalService.listarFechaMascota(fecha);
    }

    @GetMapping("/puntuacion/{puntuacion}")
    public List<ReseñaProfesionalDTO> listarPorPuntuacion(@PathVariable Integer puntuacion) {
        return reseñaProfesionalService.listarPuntuacion(puntuacion);
    }

    @GetMapping("/activos/{activo}")
    public List<ReseñaProfesionalDTO> listarActivos(@PathVariable Boolean activo) {
        return reseñaProfesionalService.listarActivos(activo);
    }

    @PostMapping
    public boolean crear(@RequestBody ReseñaProfesionalDTO dto) {
        return reseñaProfesionalService.alta(dto);
    }

    @PutMapping("/{id}")
    public ReseñaProfesional actualizar(@PathVariable Integer id, @RequestBody ReseñaProfesionalDTO dto) {
        return reseñaProfesionalService.actualizar(id, dto);
    }

    @PutMapping("/{id}/aprobar")
    public boolean aprobarReseña(@PathVariable Integer id) {
        return reseñaProfesionalService.aprobarReseña(id);
    }

    @PutMapping("/{id}/desaprobar")
    public boolean desaprobarReseña(@PathVariable Integer id) {
        return reseñaProfesionalService.desaprobarReseña(id);
    }

    @DeleteMapping("/{id}")
    public boolean eliminar(@PathVariable Integer id) {
        return reseñaProfesionalService.baja(id);
    }
}
