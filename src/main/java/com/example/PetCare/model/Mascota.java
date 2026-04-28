package com.example.PetCare.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor

@Data

public class Mascota {
    private int idMascota;
    private String nombre;
    private String especie;
    private String raza;
    private int edad;
    private double peso;
    private int idUsuario;


}