package com.example.PetCare.controller;

import com.example.PetCare.dto.ResetPasswordRequest;
import com.example.PetCare.dto.UsuarioDTO;
import com.example.PetCare.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Listar todos los usuarios: solo ADMIN (información sensible de usuarios)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDTO> listarTodos() {
        return usuarioService.listarTodos();
    }

    // Buscar usuario por ID: solo ADMIN
    @GetMapping("/buscar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Buscar por email: solo ADMIN (información sensible)
    @GetMapping("/buscar/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioDTO buscarPorEmail(@PathVariable String email) {
        return usuarioService.findByEmail(email).orElse(null);
    }

    // Buscar por nombre: solo ADMIN
    @GetMapping("/buscar/nombre/{nombre}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDTO> findByNombre(@PathVariable String nombre) {
        return usuarioService.findByNombre(nombre);
    }

    // Buscar por teléfono: solo ADMIN
    @GetMapping("/buscar/telefono/{telefono}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDTO> findByTelefono(@PathVariable String telefono) {
        return usuarioService.findByTelefono(telefono);
    }

    // Buscar por dirección: solo ADMIN
    @GetMapping("/buscar/direccion/{direccion}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDTO> findByDireccion(@PathVariable String direccion) {
        return usuarioService.findByDireccion(direccion);
    }

    // Buscar por estado activo: solo ADMIN
    @GetMapping("/buscar/activo/{activo}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDTO> findByActivo(@PathVariable boolean activo) {
        return usuarioService.findByActivo(activo);
    }

    // Crear usuario: solo ADMIN (el registro público usa AuthController, no este endpoint)
    @PostMapping("/crear")
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioDTO crear(@RequestBody @Valid UsuarioDTO dto) {
        return usuarioService.crear(dto);
    }

    // Actualizar usuario: solo ADMIN (un usuario no debería poder modificarse a sí mismo directamente)
    @PutMapping("/actualizar")
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioDTO actualizar(@RequestBody @Valid UsuarioDTO dto) {
        return usuarioService.actualizar(dto);
    }

    // Eliminar usuario: solo ADMIN (operación destructiva)
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Integer id) {
        usuarioService.eliminar(id);
    }

    // ==================== RESTABLECER CONTRASEÑA (SOLO ADMIN) ====================

    /**
     * Permite al admin restablecer la contraseña de cualquier usuario.
     * El usuario queda con la nueva contraseña y la anterior queda invalidada.
     *
     * Flujo: El usuario olvidó su contraseña → contacta al admin →
     *        admin busca al usuario → hace este endpoint con la nueva contraseña →
     *        el usuario puede loguearse con la nueva contraseña.
     *
     * Ejemplo: PUT /api/usuarios/3/reset-password
     * Body: { "nuevaPassword": "micontrasegura123" }
     */
    @PutMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> resetPassword(
            @PathVariable int id,
            @RequestBody @Valid ResetPasswordRequest request) {
        // Llama al service para que actualice la contraseña en Spring Security
        usuarioService.resetPassword(id, request.getNuevaPassword());
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña restablecida exitosamente"));
    }
}
