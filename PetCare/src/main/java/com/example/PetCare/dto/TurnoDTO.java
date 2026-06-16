package com.example.PetCare.dto;

import com.example.PetCare.enums.Estado_Turno;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurnoDTO {
    private Integer id;

    @NotNull
    @Future
    private LocalDate fecha;

    @NotNull
    private Integer id_mascota;

    @NotNull
    private Integer id_profesional;

    @NotNull
    private Estado_Turno estadoTurno;

    private Integer horas;

    private Double precio;

    private Boolean activo;
}
