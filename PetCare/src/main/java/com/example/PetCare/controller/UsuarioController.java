package com.example.PetCare.controller;

import com.example.PetCare.dto.UsuarioDTO;
import com.example.PetCare.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public List<UsuarioDTO> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> crear(@RequestBody UsuarioDTO dto) {
        boolean creado = usuarioService.crear(dto);
        if (creado) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuario creado correctamente");
        }
        return ResponseEntity.badRequest().body("No se pudo crear el usuario");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizar(@PathVariable Integer id,
                                             @RequestBody UsuarioDTO dto) {
        boolean actualizado = usuarioService.actualizar(id, dto);
        if (actualizado) {
            return ResponseEntity.ok("Usuario actualizado correctamente");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarLogico(@PathVariable Integer id) {
        boolean eliminado = usuarioService.eliminarLogico(id);
        if (eliminado) {
            return ResponseEntity.ok("Usuario eliminado correctamente");
        }
        return ResponseEntity.notFound().build();
    }
}
