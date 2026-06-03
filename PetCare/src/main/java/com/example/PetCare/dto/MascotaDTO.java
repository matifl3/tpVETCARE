package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MascotaDTO {
    private int idMascota;
    private String nombre;
    private String especie;
    private String raza;
    private int edad;
    private double peso;
    private int idUsuario;
}
