package com.example.PetCare.enums;

/**
 * Cuando un profesional se registra, queda en estado PENDIENTE.
 * Un administrador debe aprobarlo o rechazarlo antes de que pueda operar.
 */
public enum EstadoProfesional {
    PENDIENTE,
    APROBADO,
    RECHAZADO
}
