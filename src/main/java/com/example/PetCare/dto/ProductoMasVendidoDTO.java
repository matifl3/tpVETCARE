package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que representa un producto más vendido en un período dado.
 * Se usa para el endpoint de productos más vendidos por mes.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoMasVendidoDTO {
    private int idProducto;
    private String nombreProducto;
    private String categoria;
    private int cantidadVendida;
    private double gananciaTotal;
}
