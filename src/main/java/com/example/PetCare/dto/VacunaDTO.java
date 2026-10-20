package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VacunaDTO {
    private int id;
    private String nombre;
    private LocalDate fechaAplicacion;
    private LocalDate fechaProximaDosis;
    private String lote;
    private String observaciones;
    private int idProfesional;
    private String nombreProfesional;
}
