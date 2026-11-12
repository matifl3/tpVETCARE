package com.example.PetCare.model;

import java.time.LocalDate;

import com.example.PetCare.enums.EstadoAdopcionMascota;
import com.example.PetCare.enums.TamanioMascota;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class MascotaAdopcion {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idMascotaAdopcion;

    private String foto;

    private String descripcion;

    private boolean castrado;
    
    private boolean desparasitado;

    @Enumerated(EnumType.STRING)
    private EstadoAdopcionMascota estado;

    @Enumerated(EnumType.STRING)
    private TamanioMascota tamanio;

    private LocalDate fechaPublicacion = LocalDate.now();

    @OneToOne
    @JoinColumn(name = "id_mascota")
    private Mascota mascota;
}
