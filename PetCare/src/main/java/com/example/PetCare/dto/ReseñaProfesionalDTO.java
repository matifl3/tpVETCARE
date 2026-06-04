package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReseñaProfesionalDTO {
    private Integer id;
    private String texto;
    private int puntuacion;
    private LocalDate fecha;
    private boolean activo;
    private int id_usuario;
    private int id_profesional;
}
