package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO del seguimiento de adiestramiento completo.
 * Contiene la información del contenedor y todos los registros de progreso anidados.
 * Se usa para mostrar el historial completo al dueño o al adiestrador.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeguimientoEntrenamientoDTO {
    // ID del seguimiento
    private int id;
    // Fecha de creación del seguimiento (cuando se registró la primera entrada)
    private LocalDate fechaCreacion;
    // Estado activo/inactivo
    private boolean activo;
    // ID de la mascota a la que pertenece este seguimiento
    private int idMascota;
    // Nombre de la mascota (para mostrar en el frontend sin hacer otra query)
    private String nombreMascota;
    // Lista de todos los registros de progreso de esta mascota
    private List<RegistroProgresoDTO> registros;
}
