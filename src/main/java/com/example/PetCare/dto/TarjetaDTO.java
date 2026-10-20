package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TarjetaDTO {
    private int idTarjeta;
    private String ultimosDigitos;
    private String titular;
    private String vencimiento;
    private boolean activo;
}
