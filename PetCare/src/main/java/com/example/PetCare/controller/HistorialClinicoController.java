package com.example.PetCare.controller;

import com.example.PetCare.dto.HistorialClinicoDTO;
import com.example.PetCare.dto.HistorialClinicoUpdateRequest;
import com.example.PetCare.dto.MedicamentoDTO;
import com.example.PetCare.dto.RegistroMedicamentoRequest;
import com.example.PetCare.dto.RegistroVacunaRequest;
import com.example.PetCare.dto.VacunaDTO;
import com.example.PetCare.service.HistorialClinicoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mascotas/{idMascota}/historial")
@PreAuthorize("isAuthenticated()")
public class HistorialClinicoController {

    private final HistorialClinicoService historialClinicoService;

    public HistorialClinicoController(HistorialClinicoService historialClinicoService) {
        this.historialClinicoService = historialClinicoService;
    }

    @GetMapping
    public ResponseEntity<HistorialClinicoDTO> obtenerHistorial(@PathVariable int idMascota) {
        return ResponseEntity.ok(historialClinicoService.obtenerHistorial(idMascota));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO')")
    public ResponseEntity<HistorialClinicoDTO> actualizarHistorial(@PathVariable int idMascota,
                                                                   @RequestBody HistorialClinicoUpdateRequest request) {
        return ResponseEntity.ok(historialClinicoService.actualizarHistorial(idMascota, request));
    }

    @PostMapping("/vacunas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO')")
    public ResponseEntity<VacunaDTO> registrarVacuna(@PathVariable int idMascota,
                                                     @RequestBody @Valid RegistroVacunaRequest request) {
        return ResponseEntity.ok(historialClinicoService.registrarVacuna(idMascota, request));
    }

    @PutMapping("/vacunas/{idVacuna}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO')")
    public ResponseEntity<VacunaDTO> actualizarVacuna(@PathVariable int idMascota,
                                                      @PathVariable int idVacuna,
                                                      @RequestBody @Valid RegistroVacunaRequest request) {
        return ResponseEntity.ok(historialClinicoService.actualizarVacuna(idMascota, idVacuna, request));
    }

    @DeleteMapping("/vacunas/{idVacuna}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO')")
    public ResponseEntity<Void> eliminarVacuna(@PathVariable int idMascota,
                                               @PathVariable int idVacuna) {
        historialClinicoService.eliminarVacuna(idMascota, idVacuna);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/medicamentos")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO')")
    public ResponseEntity<MedicamentoDTO> registrarMedicamento(@PathVariable int idMascota,
                                                               @RequestBody @Valid RegistroMedicamentoRequest request) {
        return ResponseEntity.ok(historialClinicoService.registrarMedicamento(idMascota, request));
    }

    @PutMapping("/medicamentos/{idMedicamento}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO')")
    public ResponseEntity<MedicamentoDTO> actualizarMedicamento(@PathVariable int idMascota,
                                                                @PathVariable int idMedicamento,
                                                                @RequestBody @Valid RegistroMedicamentoRequest request) {
        return ResponseEntity.ok(historialClinicoService.actualizarMedicamento(idMascota, idMedicamento, request));
    }

    @DeleteMapping("/medicamentos/{idMedicamento}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO')")
    public ResponseEntity<Void> eliminarMedicamento(@PathVariable int idMascota,
                                                    @PathVariable int idMedicamento) {
        historialClinicoService.eliminarMedicamento(idMascota, idMedicamento);
        return ResponseEntity.noContent().build();
    }
}
