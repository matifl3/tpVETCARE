package com.example.PetCare.controller;

import com.example.PetCare.model.Profesional;
import com.example.PetCare.service.ProfesionalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profesionales")
@RequiredArgsConstructor
public class ProfesionalController {

    private final ProfesionalService profesionalService;

    @PostMapping("/crear")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Profesional> crear(@RequestBody Profesional profesional){
        return ResponseEntity.ok(profesionalService.crear(profesional));
    }

    //todo: agregar seguridad(tizi)
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id){
        profesionalService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping()
    public ResponseEntity<List<Profesional>> listarTodos(){
        return ResponseEntity.ok(profesionalService.listarTodos());
    }
}
