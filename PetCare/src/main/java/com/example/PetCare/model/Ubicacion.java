package com.example.PetCare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ubicacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUbicacion;

    private Double latitud;
    private Double longitud;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "id_paseo")
    @JsonIgnore
    private Paseo paseo;
}
