package com.example.PetCare.dto;

import com.example.PetCare.enums.Estado_Carrito;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarritoDTO {
    private int id;
    private int idUsuario;
    private Estado_Carrito estado;
    private LocalDate fechaCreacion;
    private LocalDate fechaActualizacion;
    private List<CarritoProductoDTO> items;
    private double total;
}
