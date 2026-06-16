package com.example.PetCare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de request para crear o actualizar un registro de progreso.
 * El adiestrador envía estos datos cuando registra una sesión de adiestramiento.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroProgresoRequest {
    // Descripción de la sesión (obligatorio)
    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    // Técnicas aplicadas (obligatorio)
    @NotBlank(message = "Las técnicas son obligatorias")
    private String tecnicas;

    // Observaciones del adiestrador (opcional)
    private String observaciones;

    // Evaluación de la sesión (obligatorio)
    @NotBlank(message = "La evaluación es obligatoria")
    private String evaluacion;
}
