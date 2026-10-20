package com.example.PetCare.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroVacunaRequest {
    @NotBlank
    private String nombre;

    @PastOrPresent
    private LocalDate fechaAplicacion;

    @Future
    private LocalDate fechaProximaDosis;

    @NotBlank
    private String lote;

    private String observaciones;
}
