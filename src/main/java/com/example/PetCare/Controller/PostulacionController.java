package com.example.PetCare.Controller;

import com.example.PetCare.model.PostulacionProfesional;
import com.example.PetCare.model.RolUsuario;
import com.example.PetCare.repository.PostulacionProfesionalRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
public class PostulacionController {

    private final PostulacionProfesionalRepository postulacionRepository;

    public PostulacionController(PostulacionProfesionalRepository postulacionRepository) {
        this.postulacionRepository = postulacionRepository;
    }

    // Muestra el formulario público de postulación.
    // Envía al modelo la lista de roles profesionales disponibles para que el
    // postulante elija a qué área quiere aplicar.
    // - Matias Z.
    @GetMapping("/postular")
    public String mostrarFormulario(Model model) {
        List<RolUsuario> rolesProfesionales = List.of(
            RolUsuario.VETERINARIO,
            RolUsuario.PASEADOR,
            RolUsuario.PELUQUERO,
            RolUsuario.ADIESTRADOR,
            RolUsuario.CUIDADOR
        );
        model.addAttribute("roles", rolesProfesionales);
        return "postular";
    }

    // Recibe los datos del formulario público de postulación.
    // Crea un registro con estado PENDIENTE para que el administrador lo revise.
    // - Matias Z.
    @PostMapping("/postular")
    public String enviarPostulacion(
            @RequestParam String nombre,
            @RequestParam String apellido,
            @RequestParam String email,
            @RequestParam(required = false) String telefono,
            @RequestParam String rolSolicitado,
            @RequestParam(required = false) String experiencia,
            @RequestParam(required = false) String descripcion,
            RedirectAttributes redirectAttributes
    ) {
        try {
            RolUsuario rol = mapRolProfesional(rolSolicitado);

            PostulacionProfesional postulacion = new PostulacionProfesional();
            postulacion.setNombre(nombre);
            postulacion.setApellido(apellido);
            postulacion.setEmail(email);
            postulacion.setTelefono(telefono);
            postulacion.setRolSolicitado(rol);
            postulacion.setExperiencia(experiencia);
            postulacion.setDescripcion(descripcion);

            postulacionRepository.save(postulacion);

            redirectAttributes.addFlashAttribute("mensaje",
                    "Postulación enviada correctamente. El equipo de PetCare revisará tu solicitud.");
            return "redirect:/postular";
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/postular";
        }
    }

    // Convierte el string del rol profesional al enum correspondiente.
    // Solo acepta roles profesionales, rechaza USUARIO, DUENO y ADMINISTRADOR.
    // - Matias Z.
    private RolUsuario mapRolProfesional(String rol) {
        return switch (rol.toLowerCase()) {
            case "veterinario" -> RolUsuario.VETERINARIO;
            case "paseador" -> RolUsuario.PASEADOR;
            case "peluquero" -> RolUsuario.PELUQUERO;
            case "adiestrador" -> RolUsuario.ADIESTRADOR;
            case "cuidador" -> RolUsuario.CUIDADOR;
            default -> throw new IllegalArgumentException("Rol profesional inválido");
        };
    }
}
