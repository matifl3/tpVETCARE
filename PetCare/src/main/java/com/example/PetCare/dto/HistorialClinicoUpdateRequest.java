package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Datos editables del historial clinico.
 * Las observaciones pueden quedar vacias; el resto del historial se gestiona
 * a traves de los endpoints de vacunas y medicamentos.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialClinicoUpdateRequest {
    private String observaciones;
}
