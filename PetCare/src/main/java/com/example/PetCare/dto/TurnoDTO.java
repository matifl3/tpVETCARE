package com.example.PetCare.dto;

import com.example.PetCare.enums.Estado_Turno;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurnoDTO {
    private int  id;
    private LocalDate fecha;
    private int id_mascota;
    private int id_profesional;
    private Estado_Turno estadoTurno;
    private boolean activo;
}
