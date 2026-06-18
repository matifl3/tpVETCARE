package com.example.PetCare.model;

import com.example.PetCare.enums.EstadoPaseo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paseo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPaseo;

    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    @Enumerated(EnumType.STRING)
    private EstadoPaseo estado;

    private boolean activo;

    @ManyToOne
    @JoinColumn(name = "id_paseador")
    private Profesional paseador;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name = "id_mascota")
    private Mascota mascota;

    @OneToMany(mappedBy = "paseo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ubicacion> ubicaciones = new ArrayList<>();
}
