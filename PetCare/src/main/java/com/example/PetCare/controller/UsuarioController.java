package com.example.PetCare.controller;

import com.example.PetCare.model.Usuario;
import com.example.PetCare.service.UsuarioService;
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
    public List<Usuario> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarPorId(id).get();
    }

    @PostMapping
    public Usuario crear(@RequestBody Usuario dto) {
        return usuarioService.crear(dto);
    }

    @PutMapping("/{id}")
    public Usuario actualizar(@PathVariable Integer id,@RequestBody Usuario dto) {
        return usuarioService.actualizar(dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        boolean eliminado = usuarioService.eliminar(id);
    }
}
