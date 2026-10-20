package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarritoProductoDTO {
    private int id;
    private int idProducto;
    private String productoNombre;
    private int cantidad;
    private double precioUnitario;
    private double subtotal;
}
