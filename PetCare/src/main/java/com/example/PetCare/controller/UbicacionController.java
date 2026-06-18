package com.example.PetCare.controller;

import com.example.PetCare.dto.UbicacionDTO;
import com.example.PetCare.dto.UbicacionRequestDTO;
import com.example.PetCare.model.Ubicacion;
import com.example.PetCare.service.UbicacionService;
import com.example.PetCare.utils.AuthUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paseos/{idPaseo}/ubicacion")
public class UbicacionController {

    private final UbicacionService ubicacionService;
    private final AuthUtils authUtils;

    public UbicacionController(UbicacionService ubicacionService, AuthUtils authUtils) {
        this.ubicacionService = ubicacionService;
        this.authUtils = authUtils;
    }

    @PostMapping
    @PreAuthorize("hasRole('PASEADOR')")
    public ResponseEntity<UbicacionDTO> enviarUbicacion(
            @PathVariable Integer idPaseo,
            @RequestBody UbicacionRequestDTO request) {
        UbicacionDTO dto = ubicacionService.guardarUbicacion(
                idPaseo, request.getLatitud(), request.getLongitud(), authUtils.getCurrentUserId());
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<Ubicacion>> obtenerUbicaciones(@PathVariable Integer idPaseo) {
        return ResponseEntity.ok(ubicacionService.obtenerUbicaciones(idPaseo));
    }
}
