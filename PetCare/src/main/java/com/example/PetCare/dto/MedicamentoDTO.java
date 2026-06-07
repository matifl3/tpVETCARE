package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicamentoDTO {
    private int id;
    private String nombre;
    private String dosis;
    private String frecuencia;
    private String duracion;
    private LocalDate fechaPrescripcion;
    private String indicaciones;
    private boolean activo;
    private int idProfesional;
    private String nombreProfesional;
}
