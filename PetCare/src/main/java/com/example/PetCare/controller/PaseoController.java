package com.example.PetCare.controller;

import com.example.PetCare.dto.PaseoDTO;
import com.example.PetCare.dto.PaseoRequestDTO;
import com.example.PetCare.service.PaseoService;
import com.example.PetCare.service.UbicacionService;
import com.example.PetCare.utils.AuthUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paseos")
public class PaseoController {

    private final PaseoService paseoService;
    private final UbicacionService ubicacionService;
    private final AuthUtils authUtils;

    public PaseoController(PaseoService paseoService, UbicacionService ubicacionService, AuthUtils authUtils) {
        this.paseoService = paseoService;
        this.ubicacionService = ubicacionService;
        this.authUtils = authUtils;
    }

    @PostMapping
    @PreAuthorize("hasRole('PASEADOR')")
    public ResponseEntity<PaseoDTO> iniciarPaseo(@RequestBody PaseoRequestDTO request) {
        PaseoDTO paseo = paseoService.iniciarPaseo(authUtils.getCurrentUserId(), request);
        return ResponseEntity.ok(paseo);
    }

    @PostMapping("/desde-turno/{idTurno}")
    @PreAuthorize("hasRole('PASEADOR')")
    public ResponseEntity<PaseoDTO> iniciarPaseoDesdeTurno(@PathVariable Integer idTurno) {
        PaseoDTO paseo = paseoService.iniciarPaseoDesdeTurno(authUtils.getCurrentUserId(), idTurno);
        return ResponseEntity.ok(paseo);
    }

    @PutMapping("/{id}/finalizar")
    @PreAuthorize("hasRole('PASEADOR')")
    public ResponseEntity<PaseoDTO> finalizarPaseo(@PathVariable Integer id) {
        PaseoDTO paseo = paseoService.finalizarPaseo(id, authUtils.getCurrentUserId());
        ubicacionService.notificarFinPaseo(id);
        return ResponseEntity.ok(paseo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaseoDTO> obtenerPaseo(@PathVariable Integer id) {
        return ResponseEntity.ok(paseoService.obtenerPorId(id));
    }

    @GetMapping("/mis-paseos-activos")
    @PreAuthorize("hasRole('PASEADOR')")
    public ResponseEntity<List<PaseoDTO>> misPaseosActivos() {
        return ResponseEntity.ok(paseoService.obtenerPaseosActivosDelPaseador(authUtils.getCurrentUserId()));
    }

    @GetMapping("/cliente")
    public ResponseEntity<List<PaseoDTO>> paseosDelCliente() {
        return ResponseEntity.ok(paseoService.obtenerPaseosDelCliente(authUtils.getCurrentUserId()));
    }
}
