package com.example.PetCare.Controller;

import com.example.PetCare.Service.MascotaService;
import com.example.PetCare.model.Mascota;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class MascotaViewController {

    @Autowired
    private MascotaService service;

    @GetMapping("/agregarMascota")
    public String mostrarFormulario() {
        return "agregarMascota";
    }

    @PostMapping("/guardarMascota")
    public String guardar(Mascota mascota) {

        service.guardar(mascota);

        return "redirect:/";
    }
}