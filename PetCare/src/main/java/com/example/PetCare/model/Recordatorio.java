package com.example.PetCare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Recordatorio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRecordatorio;

    @ManyToOne
    @JoinColumn(name = "id_veterinario")
    private Profesional veterinario;

    @ManyToOne
    @JoinColumn(name = "id_duenio")
    private Usuario duenio;

    @ManyToOne
    @JoinColumn(name = "id_mascota")
    private Mascota mascota;

    private String titulo;
    private String descripcion;
    private LocalDateTime fechaHora;
    private LocalDate fechaCreacion;
}
