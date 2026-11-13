package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que representa la cantidad de turnos de un período (día, semana o mes).
 * Se usa para el gráfico "Turnos por período" del panel de administración.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurnoPeriodoDTO {
    // Clave técnica del período: "2026-06", "2026-06-12" o "2026-W24"
    private String periodo;
    // Etiqueta legible para el gráfico: "Jun 2026", "12/06" o "Sem 24"
    private String etiqueta;
    private long cantidad;
}
