package com.example.PetCare.controller;

import com.example.PetCare.dto.HistorialClinicoDTO;
import com.example.PetCare.dto.MedicamentoDTO;
import com.example.PetCare.dto.RegistroMedicamentoRequest;
import com.example.PetCare.dto.RegistroVacunaRequest;
import com.example.PetCare.dto.VacunaDTO;
import com.example.PetCare.service.HistorialClinicoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mascotas/{idMascota}/historial")
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

    @PostMapping("/vacunas")
    public ResponseEntity<VacunaDTO> registrarVacuna(@PathVariable int idMascota,
                                                     @RequestBody RegistroVacunaRequest request) {
        return ResponseEntity.ok(historialClinicoService.registrarVacuna(idMascota, request));
    }

    @PostMapping("/medicamentos")
    public ResponseEntity<MedicamentoDTO> registrarMedicamento(@PathVariable int idMascota,
                                                               @RequestBody RegistroMedicamentoRequest request) {
        return ResponseEntity.ok(historialClinicoService.registrarMedicamento(idMascota, request));
    }
}
