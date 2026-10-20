package com.example.PetCare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroMedicamentoRequest {
    @NotBlank
    private String nombre;

    @NotBlank
    private String dosis;

    @NotBlank
    private String frecuencia;

    private String duracion;

    @PastOrPresent
    private LocalDate fechaPrescripcion;

    private String indicaciones;
}
