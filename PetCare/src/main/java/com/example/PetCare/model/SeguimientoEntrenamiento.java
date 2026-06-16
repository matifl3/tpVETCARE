package com.example.PetCare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad contenedor del seguimiento de adiestramiento de una mascota.
 * Sigue el mismo patrón que HistorialClinico: 1-to-1 con Mascota,
 * y contiene una lista de registros de progreso (OneToMany).
 *
 * Se crea automáticamente cuando el adiestrador registra la primera entrada.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeguimientoEntrenamiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Fecha de creación del seguimiento (se establece una sola vez)
    private LocalDate fechaCreacion;

    // Campo para soft-delete (por consistencia con el resto del proyecto)
    private boolean activo;

    // Relación 1-to-1 con Mascota: cada mascota tiene un solo seguimiento de adiestramiento
    @OneToOne
    @JoinColumn(name = "id_mascota")
    @JsonIgnore  // Evita loops infinitos al serializar (la mascota ya tiene referencia al seguimiento)
    private Mascota mascota;

    // Lista de registros de progreso: cada entrada es una sesión de adiestramiento
    // cascade = ALL: si se borra el seguimiento, se borran todos los registros
    // orphanRemoval = true: si se elimina un registro de la lista, se borra de la BD
    @OneToMany(mappedBy = "seguimiento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RegistroProgreso> registros = new ArrayList<>();
}
