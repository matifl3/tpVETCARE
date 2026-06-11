package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReseñaProductoDTO {
    private int id;
    private String comentario;
    private int puntuacion;
    private LocalDate fecha;
    private boolean activo;
    private int id_usuario;
    private int id_producto;
}
