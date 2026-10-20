package com.example.PetCare.dto;

import com.example.PetCare.enums.EstadoProfesional;
import com.example.PetCare.enums.Rol;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para transferir datos de profesionales entre capas.
 * Incluye el estado de aprobación (PENDIENTE, APROBADO, RECHAZADO).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfesionalDTO {
    private int id;
    private String nombre;
    private String apellido;
    @Email
    private String email;
    private String telefono;
    private Rol rol;
    private boolean activo;
    private String matricula;
    private String experiencia;
    private EstadoProfesional estado;
    private Double precioBase;
    private Double precioHora;
}
