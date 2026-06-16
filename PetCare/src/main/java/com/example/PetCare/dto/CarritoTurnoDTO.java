package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarritoTurnoDTO {
    private Integer id;
    private Integer idProfesional;
    private String nombreProfesional;
    private String rolProfesional;
    private Integer idMascota;
    private String nombreMascota;
    private LocalDate fecha;
    private Integer horas;
    private Double precio;
}
