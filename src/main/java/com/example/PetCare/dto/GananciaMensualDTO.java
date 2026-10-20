package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que representa las ganancias de un mes específico.
 * Se usa para el endpoint de ganancias mensuales.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GananciaMensualDTO {
    private int anio;
    private int mes;
    private long cantidadVentas;
    private double gananciaTotal;
}
