package com.example.PetCare.controller;

import com.example.PetCare.model.Usuario;
import com.example.PetCare.service.UsuarioService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Usuario> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/buscar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Usuario buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarPorId(id).get();
    }

    @GetMapping("/buscar/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public Optional<Usuario> buscarPorEmail(@PathVariable String email) {
        return usuarioService.findByEmail(email);
    }

    @GetMapping("/buscar/nombre/{nombre}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Usuario> findByNombre(@PathVariable String nombre) {
        return usuarioService.findByNombre(nombre);
    }

    @GetMapping("/buscar/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public Optional<Usuario> findByEmail(@PathVariable String email) {
        return usuarioService.findByEmail(email);
    }

    @GetMapping("/buscar/telefono/{telefono}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Usuario> findByTelefono(@PathVariable String telefono) {
        return usuarioService.findByTelefono(telefono);
    }

    @GetMapping("/buscar/direccion/{direccion}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Usuario> findByDireccion(@PathVariable String direccion) {
        return usuarioService.findByDireccion(direccion);
    }

    @GetMapping("/buscar/activo/{activo}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Usuario> findByActivo(@PathVariable boolean activo) {
        return usuarioService.findByActivo(activo);
    }

    @PostMapping("/crear")
    public Usuario crear(@RequestBody Usuario dto) {
        return usuarioService.crear(dto);
    }

    @PutMapping("/actualizar/{id}")
    public Usuario actualizar(@PathVariable Integer id,@RequestBody Usuario dto) {
        return usuarioService.actualizar(dto);
    }

    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Integer id) {
        usuarioService.eliminar(id);
    }
}
