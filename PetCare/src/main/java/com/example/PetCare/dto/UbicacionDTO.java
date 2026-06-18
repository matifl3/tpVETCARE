package com.example.PetCare.dto;

import com.example.PetCare.enums.EstadoPaseo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UbicacionDTO {
    private Double latitud;
    private Double longitud;
    private LocalDateTime timestamp;
    private EstadoPaseo estadoPaseo;
}
