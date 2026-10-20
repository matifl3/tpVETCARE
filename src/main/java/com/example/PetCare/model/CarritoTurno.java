package com.example.PetCare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "carrito_turno")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarritoTurno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_carrito")
    @JsonIgnore
    private Carrito carrito;

    private Integer idProfesional;
    private String nombreProfesional;
    private String rolProfesional;
    private Integer idMascota;
    private String nombreMascota;
    private LocalDate fecha;
    private Integer horas;
    private Double precio;
}
