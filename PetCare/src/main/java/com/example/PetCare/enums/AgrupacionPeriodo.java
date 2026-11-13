package com.example.PetCare.enums;

/**
 * Granularidad con la que se agrupan los turnos en el panel de estadísticas.
 * El frontend envía uno de estos valores y el servicio lo traduce al formato
 * de fecha que entiende la consulta (nunca se recibe un formato arbitrario).
 */
public enum AgrupacionPeriodo {
    DIA,
    SEMANA,
    MES
}
