package com.example.PetCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para que el usuario logueado cambie su propia contraseña.
 * Tiene que mandar la contraseña actual (para confirmar que es él) y la nueva.
 * Las validaciones se hacen en UsuarioService para devolver mensajes claros al front.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CambiarPasswordRequest {
    private String passwordActual;
    private String nuevaPassword;
}
