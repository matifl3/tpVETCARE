package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO de cada registro de progreso individual.
 * Representa una sesión de adiestramiento con sus detalles.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroProgresoDTO {
    // ID del registro
    private int id;
    // Fecha de la sesión de adiestramiento
    private LocalDate fecha;
    // Descripción de lo que se hizo
    private String descripcion;
    // Técnicas aplicadas
    private String tecnicas;
    // Observaciones del adiestrador
    private String observaciones;
    // Evaluación de la sesión
    private String evaluacion;
    // ID del adiestrador que creó este registro
    private int idProfesional;
    // Nombre completo del adiestrador (para mostrar en el frontend)
    private String nombreProfesional;
}
