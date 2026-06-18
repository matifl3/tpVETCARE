package com.example.PetCare.controller;

import com.example.PetCare.dto.TurnoDTO;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.service.TurnoService;
import com.example.PetCare.utils.AuthUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/turnos")
public class TurnoController {

    private final TurnoService turnoService;
    private final AuthUtils authUtils;

    public TurnoController(TurnoService turnoService, AuthUtils authUtils) {
        this.turnoService = turnoService;
        this.authUtils = authUtils;
    }

    // Listar turnos: solo ADMIN puede ver todos los turnos del sistema
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<TurnoDTO> listarTodos() {
        return turnoService.listarTodos();
    }

    // CLIENTE: listar turnos de sus mascotas
    @GetMapping("/mis-turnos")
    @PreAuthorize("hasRole('CLIENTE')")
    public List<TurnoDTO> listarMisTurnos() {
        Usuario user = authUtils.getCurrentUsuario();
        return turnoService.listarPorCliente(user.getIdUsuario());
    }

    // CLIENTE: solicitar un turno con un profesional
    @PostMapping("/solicitar")
    @PreAuthorize("hasRole('CLIENTE')")
    public TurnoDTO solicitar(@RequestBody @Valid TurnoDTO dto) {
        return turnoService.solicitar(dto);
    }

    // Listar turnos activos: ADMIN y PROFESIONALES pueden ver turnos activos
    @GetMapping("/activos")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO') or hasRole('PASEADOR') or hasRole('PELUQUERO') or hasRole('ADIESTRADOR') or hasRole('CUIDADOR')")
    public List<TurnoDTO> listarActivos() {
        return turnoService.listarTodosTurnosActivos();
    }

    // Listar turnos por mascota: ADMIN, VETERINARIO o el CLIENTE de la mascota
    @GetMapping("/mascota/{idMascota}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO')")
    public List<TurnoDTO> listarPorMascota(@PathVariable Integer idMascota) {
        return turnoService.listarTurnoXMascota(idMascota);
    }

    // Listar turnos por profesional: ADMIN o el propio PROFESIONAL
    @GetMapping("/profesional/{idProfesional}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO') or hasRole('PASEADOR') or hasRole('PELUQUERO') or hasRole('ADIESTRADOR') or hasRole('CUIDADOR')")
    public List<TurnoDTO> listarPorProfesional(@PathVariable Integer idProfesional) {
        return turnoService.listarTurnoXProfesional(idProfesional);
    }

    // CLIENTE: verificar disponibilidad de un profesional en una fecha
    @GetMapping("/disponibilidad/{idProfesional}")
    public ResponseEntity<Map<String, Object>> verificarDisponibilidad(
            @PathVariable Integer idProfesional,
            @RequestParam String fecha) {
        LocalDate fechaParsed = LocalDate.parse(fecha);
        boolean disponible = turnoService.estaDisponible(idProfesional, fechaParsed);
        return ResponseEntity.ok(Map.of(
            "disponible", disponible,
            "mensaje", disponible
                ? "El profesional está disponible en esa fecha"
                : "El profesional no tiene disponibilidad para la fecha " + fecha
        ));
    }

    // Filtros por fecha: solo ADMIN y PROFESIONALES (son vistas de gestión)
    @GetMapping("/fecha/antes/{fecha}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO') or hasRole('PASEADOR') or hasRole('PELUQUERO') or hasRole('ADIESTRADOR') or hasRole('CUIDADOR')")
    public List<TurnoDTO> listarAntesDe(@PathVariable LocalDate fecha) {
        return turnoService.listarFechaBefore(fecha);
    }

    @GetMapping("/fecha/despues/{fecha}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO') or hasRole('PASEADOR') or hasRole('PELUQUERO') or hasRole('ADIESTRADOR') or hasRole('CUIDADOR')")
    public List<TurnoDTO> listarDespuesDe(@PathVariable LocalDate fecha) {
        return turnoService.listarFechaAfter(fecha);
    }

    @GetMapping("/fecha/{fecha}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO') or hasRole('PASEADOR') or hasRole('PELUQUERO') or hasRole('ADIESTRADOR') or hasRole('CUIDADOR')")
    public List<TurnoDTO> listarPorFecha(@PathVariable LocalDate fecha) {
        return turnoService.listarFechaMascota(fecha);
    }

    // Crear turno: solo PROFESIONALES y ADMIN pueden crear turnos
    // (un CLIENTE no debería crear turnos directamente, debería solicitarlos)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO') or hasRole('PASEADOR') or hasRole('PELUQUERO') or hasRole('ADIESTRADOR') or hasRole('CUIDADOR')")
    public TurnoDTO crear(@RequestBody @Valid TurnoDTO dto) {
        return turnoService.crear(dto);
    }

    // Actualizar turno: solo ADMIN y PROFESIONALES asignados
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO') or hasRole('PASEADOR') or hasRole('PELUQUERO') or hasRole('ADIESTRADOR') or hasRole('CUIDADOR')")
    public TurnoDTO actualizar(@PathVariable Integer id, @RequestBody @Valid TurnoDTO dto) {
        return turnoService.actualizar(id, dto);
    }

    // Eliminar turno: solo ADMIN (operación destructiva)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Integer id) {
        turnoService.eliminar(id);
    }

    // Cancelar turno: ADMIN o el PROFESIONAL asignado
    @PutMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO') or hasRole('PASEADOR') or hasRole('PELUQUERO') or hasRole('ADIESTRADOR') or hasRole('CUIDADOR')")
    public boolean cancelarTurno(@PathVariable Integer id) {
        return turnoService.cancelaTurno(id);
    }

    // Confirmar turno: solo el PROFESIONAL asignado o ADMIN
    @PutMapping("/{id}/confirmar")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO') or hasRole('PASEADOR') or hasRole('PELUQUERO') or hasRole('ADIESTRADOR') or hasRole('CUIDADOR')")
    public boolean confirmarTurno(@PathVariable Integer id) {
        return turnoService.confirmarTurno(id);
    }
}
