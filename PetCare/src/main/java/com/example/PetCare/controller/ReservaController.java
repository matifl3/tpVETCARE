package com.example.PetCare.controller;

import com.example.PetCare.dto.ReservaDTO;
import com.example.PetCare.service.ReservaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping
    public List<ReservaDTO> listarTodos() {
        return reservaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaDTO> buscarPorId(@PathVariable Integer id) {
        return reservaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> crear(@RequestBody ReservaDTO dto) {
        boolean creado = reservaService.crear(dto);
        if (creado) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Reserva creada correctamente");
        }
        return ResponseEntity.badRequest().body("No se pudo crear la reserva");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizar(@PathVariable Integer id,
                                             @RequestBody ReservaDTO dto) {
        boolean actualizado = reservaService.actualizar(id, dto);
        if (actualizado) {
            return ResponseEntity.ok("Reserva actualizada correctamente");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        boolean eliminado = reservaService.eliminar(id);
        if (eliminado) {
            return ResponseEntity.ok("Reserva eliminada correctamente");
        }
        return ResponseEntity.notFound().build();
    }
}
