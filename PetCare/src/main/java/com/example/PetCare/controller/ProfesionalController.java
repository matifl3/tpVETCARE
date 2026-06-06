package com.example.PetCare.controller;

import com.example.PetCare.dto.ProfesionalDTO;
import com.example.PetCare.enums.Rol;
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
    public ResponseEntity<List<ProfesionalDTO>> listarTodos(){
        return ResponseEntity.ok(profesionalService.listarTodosDTO());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfesionalDTO> buscarPorId(@PathVariable int id){
        return profesionalService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/rol/{rol}")
    public ResponseEntity<List<ProfesionalDTO>> buscarPorRol(@PathVariable Rol rol){
        return ResponseEntity.ok(profesionalService.buscarPorRol(rol));
    }

    @GetMapping("/apellido/{apellido}")
    public ResponseEntity<List<ProfesionalDTO>> buscarPorApellido(@PathVariable String apellido){
        return ResponseEntity.ok(profesionalService.buscarPorApellido(apellido));
    }

    @GetMapping("/matricula/{matricula}")
    public ResponseEntity<ProfesionalDTO> buscarPorMatricula(@PathVariable String matricula){
        return profesionalService.buscarPorMatricula(matricula)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Profesional> actualizar(@RequestBody Profesional profesional, @PathVariable int id){
        return ResponseEntity.ok(profesionalService.actualizar(id, profesional));
    }
}
