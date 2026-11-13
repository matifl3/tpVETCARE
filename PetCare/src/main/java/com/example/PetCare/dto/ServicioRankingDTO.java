package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que representa un servicio (rol del profesional) en el ranking
 * de servicios más solicitados del panel de administración.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicioRankingDTO {
    private String servicio;
    private long cantidad;
    private double porcentaje;
}
