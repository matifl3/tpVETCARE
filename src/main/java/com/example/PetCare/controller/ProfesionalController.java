package com.example.PetCare.controller;

import com.example.PetCare.dto.ProfesionalDTO;
import com.example.PetCare.enums.EstadoProfesional;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.service.ProfesionalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profesionales")
@RequiredArgsConstructor
public class ProfesionalController {

    private final ProfesionalService profesionalService;

    @PostMapping("/crear")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProfesionalDTO> crear(@RequestBody @Valid Profesional profesional){
        return ResponseEntity.ok(profesionalService.toDTO(profesionalService.crear(profesional)));
    }

    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable int id){
        profesionalService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProfesionalDTO> actualizar(@RequestBody @Valid Profesional profesional, @PathVariable int id){
        return ResponseEntity.ok(profesionalService.toDTO(profesionalService.actualizar(id, profesional)));
    }

    // ==================== ENDPOINTS DE APROBACIÓN (SOLO ADMIN) ====================

    /**
     * Lista todos los profesionales pendientes de aprobación.
     * El admin usa este endpoint para ver quién necesita revisión.
     *
     * Ejemplo: GET /api/profesionales/pendientes
     */
    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfesionalDTO>> listarPendientes() {
        return ResponseEntity.ok(profesionalService.buscarPendientes());
    }

    /**
     * Lista todos los profesionales en un estado específico (PENDIENTE, APROBADO, RECHAZADO).
     * Permite al admin filtrar por estado.
     *
     * Ejemplo: GET /api/profesionales/estado/APROBADO
     */
    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfesionalDTO>> listarPorEstado(@PathVariable EstadoProfesional estado) {
        return ResponseEntity.ok(profesionalService.buscarPorEstado(estado));
    }

    /**
     * Aprueba un profesional: cambia su estado a APROBADO y lo activa.
     * Una vez aprobado, el profesional puede ofrecer servicios.
     *
     * Ejemplo: PUT /api/profesionales/1/aprobar
     */
    @PutMapping("/{id}/aprobar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> aprobar(@PathVariable int id) {
        boolean aprobado = profesionalService.aprobar(id);
        if (aprobado) {
            return ResponseEntity.ok(Map.of("mensaje", "Profesional aprobado correctamente"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "No se pudo aprobar al profesional"));
    }

    /**
     * Rechaza un profesional: cambia su estado a RECHAZADO y lo desactiva.
     * Un profesional rechazado no puede ofrecer servicios.
     *
     * Ejemplo: PUT /api/profesionales/1/rechazar
     */
    @PutMapping("/{id}/rechazar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> rechazar(@PathVariable int id) {
        boolean rechazado = profesionalService.rechazar(id);
        if (rechazado) {
            return ResponseEntity.ok(Map.of("mensaje", "Profesional rechazado correctamente"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "No se pudo rechazar al profesional"));
    }
}
