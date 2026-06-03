package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaDTO {
    private int idReserva;
    private LocalDate fecha;
    private LocalTime hora;
    private String servicio;
    private String estado;
    private int idUsuario;
    private int idCuidador;
    private int idMascota;
}
