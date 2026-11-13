package com.example.PetCare.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.PetCare.dto.MascotaAdopcionDTO;
import com.example.PetCare.service.MascotaAdopcionService;

import jakarta.validation.Valid;

@RestController 
@RequestMapping ("/api/mascotas/adopcion")
public class MascotaAdopcionController {

    private final MascotaAdopcionService mascotaAdopcionService;

    public MascotaAdopcionController(MascotaAdopcionService mascotaAdopcionService) {
        this.mascotaAdopcionService = mascotaAdopcionService;
    }
    

    // =========================================================================
    // CONSULTAS Y LISTADOS
    // =========================================================================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<MascotaAdopcionDTO> listarTodos(){
        return mascotaAdopcionService.listarTodos();
    }

    @GetMapping ("/{id}")
    public ResponseEntity<MascotaAdopcionDTO> buscarPorId(@PathVariable Integer id){
        return mascotaAdopcionService.buscarPorId(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping ("/especie/{especie}")
    public List<MascotaAdopcionDTO> buscarPorEspecie (@PathVariable String especie){
        return mascotaAdopcionService.buscarPorEspecie(especie);
    }
    
    @GetMapping ("/raza/{raza}")
    public List<MascotaAdopcionDTO> buscarPorRaza (@PathVariable String raza){
        return mascotaAdopcionService.buscarPorRaza(raza);
    }
    
    @GetMapping ("/disponibles")
    public List<MascotaAdopcionDTO> listarDisponibles(){
        return mascotaAdopcionService.listarDisponibles();
    }

    @GetMapping ("/adoptadas")
    @PreAuthorize("hasRole('ADMIN')")
    public List<MascotaAdopcionDTO> listarAdoptadas(){
        return mascotaAdopcionService.listarAdoptadas();
    }
    
    @GetMapping ("/pausadas")
    @PreAuthorize("hasRole('ADMIN')")
    public List<MascotaAdopcionDTO> listarPausadas(){
        return mascotaAdopcionService.listarPausadas();
    }

    @GetMapping ("/elegibles")
    @PreAuthorize ("hasRole('ADMIN')")
    public List<MascotaAdopcionDTO> listarElegibles (){
        return mascotaAdopcionService.listarMascotasElegibles();
    }


    // =========================================================================
    // ABM Y GESTIÓN DE ESTADOS
    // =========================================================================
    @PostMapping ("/crear")
    @PreAuthorize ("hasRole('ADMIN')")
    public MascotaAdopcionDTO crearPublicacion (@RequestBody @Valid MascotaAdopcionDTO dto){
        return mascotaAdopcionService.crearPublicacion(dto);
    }

    @PatchMapping ("/actualizar/{id}")
    @PreAuthorize ("hasRole('ADMIN')")
    public MascotaAdopcionDTO actualizarPublicacion (@PathVariable Integer id, @RequestBody @Valid MascotaAdopcionDTO dto){
        return mascotaAdopcionService.actualizarPublicacion(id, dto);
    }

    @PatchMapping ("/pausar/{id}")
    @PreAuthorize ("hasRole('ADMIN')")
    public void pausarPublicacion (@PathVariable Integer id){
        mascotaAdopcionService.pausarPublicacion(id);
    }

    @PatchMapping ("/reanudar/{id}")
    @PreAuthorize ("hasRole('ADMIN')")
    public void reanudarPublicacion (@PathVariable Integer id){
        mascotaAdopcionService.reanudarPublicacionPausada(id);
    }

    @PatchMapping ("/republicar/{id}")
    @PreAuthorize ("hasRole('ADMIN')")
    public void republicarPublicacion (@PathVariable Integer id){
        mascotaAdopcionService.republicarPublicacionAdoptada(id);
    }
}
