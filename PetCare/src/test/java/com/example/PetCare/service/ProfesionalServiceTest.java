package com.example.PetCare.service;

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
        assertArrayEquals(new double[]{base, porHora}, ProfesionalService.calcularPrecios(rol));
    }
}
