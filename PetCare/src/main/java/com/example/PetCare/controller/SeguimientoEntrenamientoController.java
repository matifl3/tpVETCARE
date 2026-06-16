package com.example.PetCare.controller;

import com.example.PetCare.dto.RegistroProgresoDTO;
import com.example.PetCare.dto.RegistroProgresoRequest;
import com.example.PetCare.dto.SeguimientoEntrenamientoDTO;
import com.example.PetCare.service.SeguimientoEntrenamientoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

/**
 * Controller para el seguimiento de adiestramiento de mascotas.
 * Permite al adiestrador registrar el progreso de cada sesión,
 * y al dueño ver cómo avanza el entrenamiento de su mascota.
 *
 * Base URL: /api/mascotas/{idMascota}/seguimiento
 */
@RestController
@RequestMapping("/api/mascotas/{idMascota}/seguimiento")
public class SeguimientoEntrenamientoController {

    private final SeguimientoEntrenamientoService seguimientoService;

    public SeguimientoEntrenamientoController(SeguimientoEntrenamientoService seguimientoService) {
        this.seguimientoService = seguimientoService;
    }

    // ==================== VER SEGUIMIENTO ====================

    /**
     * Obtiene el seguimiento completo de adiestramiento de una mascota.
     * Incluye todos los registros de progreso ordenados por fecha.
     *
     * Acceso:
     * - DUENIO: solo sus propias mascotas
     * - ADIESTRADOR: mascotas con turno propio
     * - ADMIN: todas las mascotas
     *
     * Ejemplo: GET /api/mascotas/5/seguimiento
     */
    @GetMapping
    public ResponseEntity<SeguimientoEntrenamientoDTO> obtenerSeguimiento(@PathVariable int idMascota) {
        SeguimientoEntrenamientoDTO dto = seguimientoService.obtenerSeguimiento(idMascota);
        return ResponseEntity.ok(dto);
    }

    // ==================== REGISTRAR PROGRESO ====================

    /**
     * Registra una nueva entrada de progreso en el adiestramiento.
     * Solo el ADIESTRADOR asignado o el ADMIN pueden crear registros.
     *
     * El contenedor SeguimientoEntrenamiento se crea automáticamente
     * si es la primera vez que se registra algo para esta mascota.
     *
     * Ejemplo: POST /api/mascotas/5/seguimiento
     * Body: {
     *   "descripcion": "Sesión de obediencia básica",
     *   "tecnicas": "Refuerzo positivo con clicker",
     *   "observaciones": "Max respondió bien al comando 'sentar'",
     *   "evaluacion": "Excelente"
     * }
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADIESTRADOR')")
    public ResponseEntity<RegistroProgresoDTO> registrarProgreso(
            @PathVariable int idMascota,
            @RequestBody @Valid RegistroProgresoRequest request) {
        RegistroProgresoDTO dto = seguimientoService.registrarProgreso(idMascota, request);
        // Retorna 201 Created con la ubicación del nuevo recurso
        return ResponseEntity.created(URI.create("/api/mascotas/" + idMascota + "/seguimiento/" + dto.getId()))
                .body(dto);
    }

    // ==================== ACTUALIZAR REGISTRO ====================

    /**
     * Actualiza un registro de progreso existente.
     * Solo el adiestrador que lo creó o el ADMIN pueden editarlo.
     *
     * Ejemplo: PUT /api/mascotas/5/seguimiento/3
     */
    @PutMapping("/{idRegistro}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ADIESTRADOR')")
    public ResponseEntity<RegistroProgresoDTO> actualizarRegistro(
            @PathVariable int idMascota,
            @PathVariable int idRegistro,
            @RequestBody @Valid RegistroProgresoRequest request) {
        RegistroProgresoDTO dto = seguimientoService.actualizarRegistro(idMascota, idRegistro, request);
        return ResponseEntity.ok(dto);
    }

    // ==================== ELIMINAR REGISTRO ====================

    /**
     * Elimina un registro de progreso.
     * Solo el ADMIN puede eliminar registros.
     *
     * Ejemplo: DELETE /api/mascotas/5/seguimiento/3
     */
    @DeleteMapping("/{idRegistro}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> eliminarRegistro(
            @PathVariable int idMascota,
            @PathVariable int idRegistro) {
        seguimientoService.eliminarRegistro(idMascota, idRegistro);
        return ResponseEntity.ok(Map.of("mensaje", "Registro eliminado exitosamente"));
    }
}
