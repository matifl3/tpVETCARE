package com.example.PetCare.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    // Clave de prueba en Base64 (más de 256 bits)
    private static final String SECRET = "VGVzdC1jbGF2ZS1zZWNyZXRhLXBhcmEtbG9zLXRlc3RzLWRlLVBldENhcmUtMTIzNDU2";

    private final JwtService jwtService = new JwtService(SECRET, 60_000);

    @Test
    @DisplayName("El token generado guarda el email del usuario")
    void generarYLeerToken() {
        String token = jwtService.generarToken("ana@test.com", "CLIENTE");

        assertEquals("ana@test.com", jwtService.extraerEmail(token));
    }

    @Test
    @DisplayName("Un token modificado se rechaza")
    void tokenModificado() {
        String token = jwtService.generarToken("ana@test.com", "CLIENTE");
        String trucho = token.substring(0, token.length() - 4) + "abcd";

        assertNull(jwtService.extraerEmail(trucho));
    }

    @Test
    @DisplayName("Un token firmado con otra clave se rechaza")
    void tokenDeOtraClave() {
        JwtService otro = new JwtService(
                "T3RyYS1jbGF2ZS1kaXN0aW50YS1xdWUtbm8tZXMtbGEtZGVsLWJhY2tlbmQtMTIzNDU2Nzg=", 60_000);
        String token = otro.generarToken("ana@test.com", "ADMIN");

        assertNull(jwtService.extraerEmail(token));
    }

    @Test
    @DisplayName("Un token vencido se rechaza")
    void tokenVencido() {
        JwtService vencido = new JwtService(SECRET, -1_000);
        String token = vencido.generarToken("ana@test.com", "CLIENTE");

        assertNull(jwtService.extraerEmail(token));
    }

    @Test
    @DisplayName("Cualquier texto que no sea un JWT se rechaza")
    void basura() {
        assertNull(jwtService.extraerEmail("esto-no-es-un-token"));
        assertNull(jwtService.extraerEmail(""));
    }
}
