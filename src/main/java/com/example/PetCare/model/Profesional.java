package com.example.PetCare.model;

import com.example.PetCare.enums.EstadoProfesional;
import com.example.PetCare.enums.Rol;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que representa a un profesional del sistema (veterinario, paseador, peluquero, etc.).
 * Extiende de Usuario para heredar los campos básicos (nombre, email, etc.).
 *
 * Campo clave: estado
 * - PENDIENTE: El profesional se registró pero aún no fue aprobado por un admin
 * - APROBADO: El admin lo aprobó, puede ofrecer servicios
 * - RECHAZADO: El admin lo rechazó, no puede ofrecer servicios
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profesional extends Usuario {
    @NotBlank
    private String matricula;

    @NotBlank
    private String experiencia;

    // Estado de aprobación del profesional. Por defecto queda PENDIENTE al registrarse.
    @Enumerated(EnumType.STRING)
    private EstadoProfesional estado;
}
