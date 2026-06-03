package com.example.PetCare.controller;

import com.example.PetCare.dto.CuidadorDTO;
import com.example.PetCare.service.CuidadorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuidadores")
public class CuidadorController {

    private final CuidadorService cuidadorService;

    public CuidadorController(CuidadorService cuidadorService) {
        this.cuidadorService = cuidadorService;
    }

    @GetMapping
    public List<CuidadorDTO> listarTodos() {
        return cuidadorService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CuidadorDTO> buscarPorId(@PathVariable Integer id) {
        return cuidadorService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> crear(@RequestBody CuidadorDTO dto) {
        boolean creado = cuidadorService.crear(dto);
        if (creado) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Cuidador creado correctamente");
        }
        return ResponseEntity.badRequest().body("No se pudo crear el cuidador");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizar(@PathVariable Integer id,
                                             @RequestBody CuidadorDTO dto) {
        boolean actualizado = cuidadorService.actualizar(id, dto);
        if (actualizado) {
            return ResponseEntity.ok("Cuidador actualizado correctamente");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        boolean eliminado = cuidadorService.eliminar(id);
        if (eliminado) {
            return ResponseEntity.ok("Cuidador eliminado correctamente");
        }
        return ResponseEntity.notFound().build();
    }
}
