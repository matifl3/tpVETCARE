package com.example.PetCare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialClinico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDate fechaCreacion;
    private boolean activo;
    private String observaciones;

    @OneToOne(mappedBy = "historialClinico")
    @JsonIgnore
    private Mascota mascota;

    @OneToMany(mappedBy = "historialClinico", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore//Cuando lo leia json habia ciclos infinitos de relaciones entre tablas y esto lo rompe
    private List<Vacuna> vacunas = new ArrayList<>();

    @OneToMany(mappedBy = "historialClinico", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Medicamento> medicamentos = new ArrayList<>();
}
