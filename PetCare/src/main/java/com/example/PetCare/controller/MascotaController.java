package com.example.PetCare.controller;

import com.example.PetCare.dto.MascotaDTO;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.service.MascotaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    private final MascotaService mascotaService;

    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    @GetMapping
    public List<MascotaDTO> listarTodos() {
        return mascotaService.listarTodos();
    }

    @GetMapping("/{id}")
    public MascotaDTO buscarPorId(@PathVariable Integer id) {
        return mascotaService.buscarPorId(id).get();
    }
    @GetMapping("/especie/{especie}")
    public List<Mascota> buscarPorEspecie(@PathVariable String especie) {
        return mascotaService.buscarPorEspecie(especie);
    }
    @GetMapping("/raza/{raza}")
    public List<Mascota> buscarPorRaza(@PathVariable String raza) {
        return mascotaService.buscarPorRaza(raza);
    }
    @GetMapping("/nombre/{nombre}")
    public List<Mascota> buscarPorNombre(@PathVariable String nombre) {
        return mascotaService.buscarPorRaza(nombre);
    }

    @PostMapping
    public MascotaDTO crear(@RequestBody MascotaDTO dto) {
        boolean creado = mascotaService.crear(dto);
        if (creado) {
            return dto;
        }else return null;

    }

    @PutMapping("/{id}")
    public MascotaDTO actualizar(@PathVariable Integer id,@RequestBody MascotaDTO dto) {
        boolean actualizado = mascotaService.actualizar(id, dto);
        if (actualizado){return dto;}
        return null;
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        boolean eliminado = mascotaService.eliminar(id);
    }
}
