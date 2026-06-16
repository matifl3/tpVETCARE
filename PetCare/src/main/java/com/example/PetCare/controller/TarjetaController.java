package com.example.PetCare.controller;

import com.example.PetCare.dto.TarjetaDTO;
import com.example.PetCare.dto.TarjetaRequestDTO;
import com.example.PetCare.model.Tarjeta;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.service.TarjetaService;
import com.example.PetCare.utils.AuthUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/tarjetas")
public class TarjetaController {

    private final TarjetaService tarjetaService;
    private final AuthUtils authUtils;

    @PostMapping("/agregar")
    public ResponseEntity<Tarjeta> agregarTarjeta(@Valid @RequestBody TarjetaRequestDTO dto){
        Usuario usuario = authUtils.getCurrentUsuario();
        dto.setIdUsuario(usuario.getIdUsuario());
        return ResponseEntity.ok(tarjetaService.agregarTarjeta(dto));
    }

    @GetMapping
    public ResponseEntity<List<TarjetaDTO>> listarTarjetas(){
        Usuario usuario = authUtils.getCurrentUsuario();
        return ResponseEntity.ok(tarjetaService.listarTarjetas(usuario.getIdUsuario()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TarjetaDTO> obtenerTarjeta(@PathVariable Integer id){
        Usuario usuario = authUtils.getCurrentUsuario();
        return ResponseEntity.ok(tarjetaService.obtenerTarjeta(id, usuario.getIdUsuario()));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarTarjeta(@PathVariable Integer id){
        Usuario usuario = authUtils.getCurrentUsuario();
        tarjetaService.eliminarTarjeta(id, usuario.getIdUsuario());
        return ResponseEntity.noContent().build();
    }
}
