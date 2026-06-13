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
public class ReseñaProfesional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String texto;
    private int puntuacion;
    private LocalDate fecha;
    private boolean activo;// es para saber si esta aprobada o no

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

}

