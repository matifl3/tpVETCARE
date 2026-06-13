package com.example.PetCare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idMascota;
    private String nombre;
    private String especie;
    private String raza;
    private String sexo;
    private double peso;
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    private String observaciones;
    private boolean activo;

    @ManyToOne
    @JoinColumn(name = "id_dueño")
    private Usuario usuario;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "id_historial")
    private HistorialClinico historialClinico;
}
