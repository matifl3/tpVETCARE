package com.example.PetCare.controller;

import com.example.PetCare.dto.RecordatorioDTO;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.Recordatorio;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.service.RecordatorioService;
import com.example.PetCare.utils.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/recordatorios")
public class RecordatorioController {

    private final RecordatorioService recordatorioService;
    private final AuthUtils authUtils;

    @PostMapping("/crear")
    public ResponseEntity<RecordatorioDTO> crear(@RequestBody RecordatorioDTO dto){
        Usuario veterinario = authUtils.getCurrentUsuario();
        dto.setIdVeterinario(veterinario.getIdUsuario());
        return ResponseEntity.ok(recordatorioService.crearRecordatorio(dto));
    }

    @GetMapping("/cliente")
    public ResponseEntity<List<RecordatorioDTO>> listarPorCliente(){
        Usuario cliente = authUtils.getCurrentUsuario();
        return ResponseEntity.ok(recordatorioService.listarPorCliente(cliente.getIdUsuario()));
    }

    @GetMapping("/veterinario")
    public ResponseEntity<List<RecordatorioDTO>> listarPorVeterinario(){
        Usuario veterinario = authUtils.getCurrentUsuario();
        return ResponseEntity.ok(recordatorioService.listarPorVeterinario(veterinario.getIdUsuario()));
    }

    @PutMapping("/modificar/{id}")
    public ResponseEntity<RecordatorioDTO> modificar(@PathVariable Integer id, @RequestBody RecordatorioDTO dto){
        Usuario veterinario = authUtils.getCurrentUsuario();
        return ResponseEntity.ok(recordatorioService.modificarRecordatorio(id, veterinario.getIdUsuario(), dto));
    }

    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id){
        Usuario veterinario = authUtils.getCurrentUsuario();
        recordatorioService.eliminarRecordatorio(id, veterinario.getIdUsuario());
        return ResponseEntity.noContent().build();
    }
}
