package com.example.PetCare.controller;

import com.example.PetCare.dto.MascotaDTO;
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
    public ResponseEntity<MascotaDTO> buscarPorId(@PathVariable Integer id) {
        return mascotaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> crear(@RequestBody MascotaDTO dto) {
        boolean creado = mascotaService.crear(dto);
        if (creado) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Mascota creada correctamente");
        }
        return ResponseEntity.badRequest().body("No se pudo crear la mascota");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizar(@PathVariable Integer id,
                                             @RequestBody MascotaDTO dto) {
        boolean actualizado = mascotaService.actualizar(id, dto);
        if (actualizado) {
            return ResponseEntity.ok("Mascota actualizada correctamente");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        boolean eliminado = mascotaService.eliminar(id);
        if (eliminado) {
            return ResponseEntity.ok("Mascota eliminada correctamente");
        }
        return ResponseEntity.notFound().build();
    }
}
