package com.example.PetCare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Cada entrada de progreso en el adiestramiento de una mascota.
 * Representa una sesión o encuentro de adiestramiento con sus detalles.
 *
 * Cada registro está asociado a:
 * - Un SeguimientoEntrenamiento (el contenedor de todos los registros de esa mascota)
 * - Un Profesional (el adiestrador que registró la entrada)
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "registro_progreso")
public class RegistroProgreso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Fecha en que se realizó la sesión de adiestramiento
    private LocalDate fecha;

    // Descripción de lo que se hizo en la sesión (ej: "Sesión de obediencia básica")
    private String descripcion;

    // Técnicas aplicadas durante la sesión (ej: "Refuerzo positivo con clicker")
    private String tecnicas;

    // Notas u observaciones del adiestrador sobre el comportamiento de la mascota
    private String observaciones;

    // Evaluación general de la sesión (ej: "Excelente", "Mejoró", "Necesita práctica")
    private String evaluacion;

    // Referencia al contenedor padre (el seguimiento de esta mascota)
    @ManyToOne
    @JoinColumn(name = "id_seguimiento")
    @JsonIgnore  // Evita loops infinitos al serializar
    private SeguimientoEntrenamiento seguimiento;

    // Profesional (adiestrador) que creó este registro
    @ManyToOne
    @JoinColumn(name = "id_profesional")
    private Profesional profesional;
}
