package com.example.PetCare.controller;

import com.example.PetCare.dto.UsuarioDTO;
import com.example.PetCare.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDTO> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/buscar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioDTO buscarPorEmail(@PathVariable String email) {
        return usuarioService.findByEmail(email).orElse(null);
    }

    @GetMapping("/buscar/nombre/{nombre}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDTO> findByNombre(@PathVariable String nombre) {
        return usuarioService.findByNombre(nombre);
    }

    @GetMapping("/buscar/telefono/{telefono}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDTO> findByTelefono(@PathVariable String telefono) {
        return usuarioService.findByTelefono(telefono);
    }

    @GetMapping("/buscar/direccion/{direccion}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDTO> findByDireccion(@PathVariable String direccion) {
        return usuarioService.findByDireccion(direccion);
    }

    @GetMapping("/buscar/activo/{activo}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioDTO> findByActivo(@PathVariable boolean activo) {
        return usuarioService.findByActivo(activo);
    }

    @PostMapping("/crear")
    public UsuarioDTO crear(@RequestBody @Valid UsuarioDTO dto) {
        return usuarioService.crear(dto);
    }

    @PutMapping("/actualizar")
    public UsuarioDTO actualizar(@RequestBody @Valid UsuarioDTO dto) {
        return usuarioService.actualizar(dto);
    }

    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Integer id) {
        usuarioService.eliminar(id);
    }
}
