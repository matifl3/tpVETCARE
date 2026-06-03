package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuidadorDTO {
    private int idCuidador;
    private String nombre;
    private String apellido;
    private String especialidad;
    private String telefono;
    private String email;
    private boolean disponible;
}
