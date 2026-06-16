package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecordatorioDTO {
    private Integer idVeterinario;
    private Integer idDuenio;
    private Integer idMascota;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaHora;
    private LocalDate fechaCreacion;
}
