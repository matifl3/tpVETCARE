package com.example.PetCare.dto;

import com.example.PetCare.enums.EstadoPaseo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaseoDTO {
    private Integer idPaseo;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private EstadoPaseo estado;
    private Integer idPaseador;
    private String nombrePaseador;
    private Integer idCliente;
    private String nombreCliente;
    private Integer idMascota;
    private String nombreMascota;
}
