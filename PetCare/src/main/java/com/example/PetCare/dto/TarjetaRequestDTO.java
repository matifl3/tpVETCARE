package com.example.PetCare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TarjetaRequestDTO {
    @NotNull
    private Integer idUsuario;

    @NotBlank
    private String titular;

    @NotBlank
    @Pattern(regexp = "\\d{13,19}")
    private String numeroTarjeta;

    @NotBlank
    @Pattern(regexp = "(0[1-9]|1[0-2])/\\d{2}")
    private String vencimiento;

    @NotBlank
    @Size(min = 3, max = 4)
    private String cvv;
}
