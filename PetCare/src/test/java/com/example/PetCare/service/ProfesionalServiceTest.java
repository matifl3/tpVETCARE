package com.example.PetCare.service;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.example.PetCare.enums.Rol;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

class ProfesionalServiceTest {

    @ParameterizedTest(name = "{0}: base {1}, por hora {2}")
    @DisplayName("Precios por tipo de profesional")
    @CsvSource({
            "VETERINARIO, 5000, 0",
            "PASEADOR,    3000, 1500",
            "PELUQUERO,   4000, 0",
            "ADIESTRADOR, 4500, 0",
            "CUIDADOR,    2500, 1500",
    })
    void calcularPrecios(Rol rol, double base, double porHora) {
        assertArrayEquals(new double[] { base, porHora }, ProfesionalService.calcularPrecios(rol));
    }

    @ParameterizedTest(name = "{0} x {1}h = {2}")
    @DisplayName("Precio total de un turno según rol y horas")
    @CsvSource({
            "VETERINARIO, 1, 5000",
            "PASEADOR,    1, 3000",
            "PASEADOR,    3, 6000",
            "CUIDADOR,    2, 4000",
    })
    void calcularPrecioTurno(Rol rol, int horas, double esperado) {
        assertEquals(esperado, ProfesionalService.calcularPrecioTurno(rol, horas));
    }

    @Test
    @DisplayName("Menos de 1 hora da error")
    void calcularPrecioTurnoHorasInvalidas() {
        assertThrows(IllegalArgumentException.class,
                () -> ProfesionalService.calcularPrecioTurno(Rol.PASEADOR, 0));
    }
}
