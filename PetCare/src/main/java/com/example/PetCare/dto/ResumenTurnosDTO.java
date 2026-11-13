package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Totales generales del período consultado en el panel de estadísticas.
 * Los turnos cancelados se informan aparte y no forman parte de "total".
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumenTurnosDTO {
    private long total;
    private long confirmados;
    private long cancelados;
    private long proximos;
    private String servicioTop;
}
