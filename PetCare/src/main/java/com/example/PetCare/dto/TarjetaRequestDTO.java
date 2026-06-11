package com.example.PetCare.dto;

import lombok.Data;

@Data
public class TarjetaRequestDTO {
    private int idUsuario;
    private String titular;
    private String numeroTarjeta;
    private String vencimiento;
    private String cvv;
}
