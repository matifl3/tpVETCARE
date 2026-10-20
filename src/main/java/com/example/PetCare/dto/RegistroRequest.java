package com.example.PetCare.dto;

import com.example.PetCare.enums.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    @NotBlank
    private String telefono;

    @NotNull
    private Rol rol;

    // Solo requeridos si el rol es profesional (VETERINARIO, PASEADOR, PELUQUERO, ADIESTRADOR, CUIDADOR)
    private String matricula;
    private String experiencia;
}
