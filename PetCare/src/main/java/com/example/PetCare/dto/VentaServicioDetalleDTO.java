package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VentaServicioDetalleDTO {
    private int idVenta;
    private LocalDate fecha;
    private String cliente;
    private String productoOServicio;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
}