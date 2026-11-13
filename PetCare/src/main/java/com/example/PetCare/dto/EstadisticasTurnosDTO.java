package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Respuesta completa del panel de estadísticas de turnos.
 * Se devuelve todo en un solo request para que los gráficos y los KPIs
 * correspondan al mismo instante de la base de datos.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasTurnosDTO {
    private String desde;
    private String hasta;
    private String agrupacion;
    private ResumenTurnosDTO resumen;
    private List<TurnoPeriodoDTO> porPeriodo;
    private List<ServicioRankingDTO> rankingServicios;
}
