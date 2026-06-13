package com.example.PetCare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vacuna {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nombre;
    private LocalDate fechaAplicacion;
    private LocalDate fechaProximaDosis;
    private String lote;
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "id_historial")
    private HistorialClinico historialClinico;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
}
