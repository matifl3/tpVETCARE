package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialClinicoDTO {
    private int id;
    private LocalDate fechaCreacion;
    private boolean activo;
    private String observaciones;
    private int idMascota;
    private String nombreMascota;
    private List<VacunaDTO> vacunas;
    private List<MedicamentoDTO> medicamentos;
}
