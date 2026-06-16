package com.example.PetCare.Controller;

import com.example.PetCare.Service.AuthService;
import com.example.PetCare.model.EstadoPostulacion;
import com.example.PetCare.model.PostulacionProfesional;
import com.example.PetCare.model.RolUsuario;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.PostulacionProfesionalRepository;
import jakarta.servlet.http.HttpSession;
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
    private final AuthService authService;

    public PostulacionController(PostulacionProfesionalRepository postulacionRepository, AuthService authService) {
        this.postulacionRepository = postulacionRepository;
        this.authService = authService;
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

    // Muestra el panel de administración de postulaciones.
    // Lista las postulaciones pendientes y el historial de aprobadas/rechazadas.
    // Solo accesible para usuarios con rol ADMINISTRADOR.
    // - Matias Z.
    @GetMapping("/admin/postulaciones")
    public String listarPostulaciones(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || (usuario.getRol() != RolUsuario.ADMINISTRADOR && usuario.getRol() != RolUsuario.DUENO)) {
            return "redirect:/";
        }

        List<PostulacionProfesional> pendientes = postulacionRepository.findByEstado(EstadoPostulacion.PENDIENTE);
        List<PostulacionProfesional> todas = postulacionRepository.findAll();

        model.addAttribute("pendientes", pendientes);
        model.addAttribute("todas", todas);
        return "admin-postulaciones";
    }

    // Aprueba una postulación pendiente.
    // Toma los datos de la postulación, crea un usuario con el rol solicitado
    // y contraseña default (PetCare123). Marca al usuario para que deba
    // cambiar la contraseña en su primer inicio de sesión.
    // - Matias Z.
    @PostMapping("/admin/postulaciones/aprobar")
    public String aprobarPostulacion(
            @RequestParam Integer id,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        Usuario usuarioSesion = (Usuario) session.getAttribute("usuario");
        if (usuarioSesion == null || (usuarioSesion.getRol() != RolUsuario.ADMINISTRADOR && usuarioSesion.getRol() != RolUsuario.DUENO)) {
            return "redirect:/";
        }

        try {
            PostulacionProfesional postulacion = postulacionRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Postulación no encontrada"));

            if (postulacion.getEstado() != EstadoPostulacion.PENDIENTE) {
                throw new IllegalArgumentException("La postulación ya fue procesada");
            }

            authService.crearUsuarioProfesional(
                    postulacion.getNombre(),
                    postulacion.getApellido(),
                    postulacion.getEmail(),
                    postulacion.getRolSolicitado()
            );

            postulacion.setEstado(EstadoPostulacion.APROBADA);
            postulacionRepository.save(postulacion);

            redirectAttributes.addFlashAttribute("mensaje",
                    "Postulación aprobada. Se creó el usuario con contraseña default PetCare123.");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }

        return "redirect:/admin/postulaciones";
    }

    // Rechaza una postulación pendiente.
    // Simplemente cambia el estado a RECHAZADA sin crear ningún usuario.
    // - Matias Z.
    @PostMapping("/admin/postulaciones/rechazar")
    public String rechazarPostulacion(
            @RequestParam Integer id,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        Usuario usuarioSesion = (Usuario) session.getAttribute("usuario");
        if (usuarioSesion == null || (usuarioSesion.getRol() != RolUsuario.ADMINISTRADOR && usuarioSesion.getRol() != RolUsuario.DUENO)) {
            return "redirect:/";
        }

        try {
            PostulacionProfesional postulacion = postulacionRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Postulación no encontrada"));

            if (postulacion.getEstado() != EstadoPostulacion.PENDIENTE) {
                throw new IllegalArgumentException("La postulación ya fue procesada");
            }

            postulacion.setEstado(EstadoPostulacion.RECHAZADA);
            postulacionRepository.save(postulacion);

            redirectAttributes.addFlashAttribute("mensaje", "Postulación rechazada.");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }

        return "redirect:/admin/postulaciones";
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
