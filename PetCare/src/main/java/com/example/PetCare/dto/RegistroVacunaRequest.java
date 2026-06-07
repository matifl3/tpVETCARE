package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/* RegistroVacunaRequest
Es un DTO de entrada (request). Representa los datos que el front manda cuando un veterinario quiere registrar una vacuna aplicada.
Para qué sirve
Separar el DTO de entrada del DTO de salida (VacunaDTO) es una buena práctica. El de entrada es lo mínimo que el front tiene que mandar;
el de salida es lo que el back devuelve. Esto te da varias ventajas:
        - No exponés campos internos que el front no debería mandar ni ver.
        - Validás input por separado del modelo de dominio. Si mañana querés agregar @NotBlank o @Size al nombre de la vacuna, lo hacés en este DTO sin tocar la entidad.

Qué NO tiene
        - id — lo genera la BD.
        - idMascota — viene por la URL (/mascotas/{idMascota}/historial/vacunas).
        - idProfesional — se toma del usuario autenticado (AuthUtils.getCurrentUsuario()). El veterinario no puede "fingir" ser otro.
        - historialClinico — el service lo resuelve buscando/creando el historial de esa mascota. */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroVacunaRequest {
    private String nombre;
    private LocalDate fechaAplicacion;
    private LocalDate fechaProximaDosis;
    private String lote;
    private String observaciones;
}
