package com.example.PetCare.model;

import com.example.PetCare.enums.Estado_Turno;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Turno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idTurno;
    private LocalDate fecha;
    @Enumerated(EnumType.STRING)
    private Estado_Turno estadoTurno;

    @ManyToOne
    @JoinColumn(name = "id_mascota")
    private Mascota mascota;

    @ManyToOne
    @JoinColumn(name = "id_profesional")
    private Profesional profesional;

    private Integer horas;

    private Double precio;

    private boolean activo;
}
