package com.example.PetCare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MascotaDTO {
    private Integer idMascota;

    @NotBlank
    private String nombre;

    @NotBlank
    private String especie;

    private String raza;
    private String sexo;

    @Positive
    private Double peso;

    private LocalDate fechaNacimiento;
    private String observaciones;
    private Boolean activo;

    private Integer idUsuario;
}
