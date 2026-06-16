package com.example.PetCare.controller;

import com.example.PetCare.dto.MascotaDTO;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.service.MascotaService;
import com.example.PetCare.utils.AuthUtils;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    private final MascotaService mascotaService;
    private final AuthUtils authUtils;

    public MascotaController(MascotaService mascotaService, AuthUtils authUtils) {
        this.mascotaService = mascotaService;
        this.authUtils = authUtils;
    }

    // Cualquier usuario autenticado puede listar mascotas (es información pública del negocio)
    @GetMapping
    public List<MascotaDTO> listarTodos() {
        return mascotaService.listarTodos();
    }

    // Cualquier usuario autenticado puede ver el detalle de una mascota
    @GetMapping("/{id}")
    public ResponseEntity<MascotaDTO> buscarPorId(@PathVariable Integer id) {
        return mascotaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/especie/{especie}")
    public List<MascotaDTO> buscarPorEspecie(@PathVariable String especie) {
        return mascotaService.buscarPorEspecie(especie);
    }
    @GetMapping("/raza/{raza}")
    public List<MascotaDTO> buscarPorRaza(@PathVariable String raza) {
        return mascotaService.buscarPorRaza(raza);
    }

    @GetMapping("/nombre/{nombre}")
    public List<MascotaDTO> buscarPorNombre(@PathVariable String nombre) {
        return mascotaService.buscarPorNombre(nombre);
    }

    // DUENIO: listar mis propias mascotas
    @GetMapping("/mias")
    @PreAuthorize("hasRole('DUENIO')")
    public List<MascotaDTO> listarMias() {
        Usuario user = authUtils.getCurrentUsuario();
        return mascotaService.listarPorDuenio(user.getIdUsuario());
    }

    // DUENIO: registrar una nueva mascota (se asigna automáticamente al dueño actual)
    @PostMapping("/mias")
    @PreAuthorize("hasRole('DUENIO')")
    public MascotaDTO crearMia(@RequestBody @Valid MascotaDTO dto) {
        Usuario user = authUtils.getCurrentUsuario();
        dto.setIdUsuario(user.getIdUsuario());
        return mascotaService.crearParaUsuario(dto, user);
    }

    // Solo ADMIN y VETERINARIO pueden crear mascotas (DUENIO no debería crear directamente,
    // debería asociar una mascota existente o ser creado por un profesional)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO')")
    public MascotaDTO crear(@RequestBody @Valid MascotaDTO dto) {
        boolean creado = mascotaService.crear(dto);
        if (creado) {
            return dto;
        } else throw new NoEncontradoException("No se pudo crear la mascota, el usuario no existe");
    }

    // Solo ADMIN puede actualizar mascotas (los demás roles no deberían modificar datos de mascotas)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MascotaDTO actualizar(@PathVariable Integer id,@RequestBody @Valid MascotaDTO dto) {
        boolean actualizado = mascotaService.actualizar(id, dto);
        if (actualizado) { return dto; }
        else throw new NoEncontradoException("No se pudo actualizar la mascota, el usuario no existe");
    }

    // Solo VETERINARIO y ADMIN pueden actualizar observaciones clínicas (es información médica)
    @PutMapping("/{id}/observaciones")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO')")
    public MascotaDTO actualizaObservaciones(@PathVariable Integer id,@RequestBody String obs){
        return mascotaService.actualizarObservacion(id,obs);
    }

    // Solo ADMIN puede eliminar mascotas (operación destructiva que requiere privilegios elevados)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Integer id) {
        boolean eliminado = mascotaService.eliminar(id);
    }
}
