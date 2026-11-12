package com.example.PetCare.dto;

import java.time.LocalDate;
import java.util.List;

import com.example.PetCare.enums.EstadoAdopcionMascota;
import com.example.PetCare.enums.TamanioMascota;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MascotaAdopcionDTO {

    private Integer idMascotaAdopcion;
    private Integer idMascota;

    // Datos provenientes de Mascota
    private String nombre;
    private String especie;
    private String raza;
    private String sexo;
    private Double peso;
    private LocalDate fechaNacimiento;
    private String observaciones;

    // Datos propios de MascotaAdopcion
    private TamanioMascota tamanio;
    private String foto;
    private String descripcion;
    private boolean castrado;
    private boolean desparasitado;
    private EstadoAdopcionMascota estado;

    // Campos de solo lectura
    private LocalDate fechaPublicacion;
    private List<String> vacunas;
}
