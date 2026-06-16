package com.example.PetCare.controller;

import com.example.PetCare.enums.EstadoProfesional;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PageController {

    private final UsuarioRepository usuarioRepository;
    private final ProfesionalRepository profesionalRepository;

    public PageController(UsuarioRepository usuarioRepository,
                          ProfesionalRepository profesionalRepository) {
        this.usuarioRepository = usuarioRepository;
        this.profesionalRepository = profesionalRepository;
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/login")
    public String login(@RequestParam(value = "registro", required = false) String registro,
                        @RequestParam(value = "tab", required = false) String tab,
                        Model model) {
        if ("exitoso".equals(registro)) {
            model.addAttribute("registroExitoso", true);
        }
        if ("register".equals(tab)) {
            model.addAttribute("mostrarRegistro", true);
        }
        return "login";
    }

    @GetMapping("/dashboard")
    public String dashboard(Authentication auth) {
        if (auth == null) return "redirect:/login";

        String role = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(r -> r.replace("ROLE_", ""))
                .findFirst().orElse("");

        return switch (role) {
            case "ADMIN" -> "redirect:/admin/dashboard";
            case "DUENIO" -> "redirect:/dashboard/duenio";
            case "VETERINARIO" -> "redirect:/dashboard/veterinario";
            case "PASEADOR" -> "redirect:/dashboard/paseador";
            case "PELUQUERO" -> "redirect:/dashboard/peluquero";
            case "ADIESTRADOR" -> "redirect:/dashboard/adiestrador";
            case "CUIDADOR" -> "redirect:/dashboard/cuidador";
            default -> "redirect:/login";
        };
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboard(Authentication auth, Model model) {
        addUserInfo(auth, model);
        model.addAttribute("profesionalesPendientes",
            profesionalRepository.findByEstado(EstadoProfesional.PENDIENTE).size());
        return "dashboards/admin";
    }

    @GetMapping("/dashboard/duenio")
    public String duenioDashboard(Authentication auth, Model model) {
        addUserInfo(auth, model);
        return "dashboards/duenio";
    }

    @GetMapping("/dashboard/duenio/mascotas")
    public String duenioMascotas(Authentication auth, Model model) {
        addUserInfo(auth, model);
        return "dashboards/duenio/mascotas";
    }

    @GetMapping("/dashboard/duenio/profesionales")
    public String duenioProfesionales(Authentication auth, Model model) {
        addUserInfo(auth, model);
        return "dashboards/duenio/profesionales";
    }

    @GetMapping("/dashboard/duenio/tienda")
    public String duenioTienda(Authentication auth, Model model) {
        addUserInfo(auth, model);
        return "dashboards/duenio/tienda";
    }

    @GetMapping("/dashboard/duenio/carrito")
    public String duenioCarrito(Authentication auth, Model model) {
        addUserInfo(auth, model);
        return "dashboards/duenio/carrito";
    }

    @GetMapping("/dashboard/duenio/mis-turnos")
    public String duenioMisTurnos(Authentication auth, Model model) {
        addUserInfo(auth, model);
        return "dashboards/duenio/mis-turnos";
    }

    @GetMapping("/dashboard/duenio/tarjetas")
    public String duenioTarjetas(Authentication auth, Model model) {
        addUserInfo(auth, model);
        return "dashboards/duenio/tarjetas";
    }

    @GetMapping("/dashboard/duenio/reservar/{idProfesional}")
    public String duenioReservar(@PathVariable Integer idProfesional, Authentication auth, Model model) {
        addUserInfo(auth, model);
        model.addAttribute("idProfesional", idProfesional);
        return "dashboards/duenio/reservar";
    }

    @GetMapping("/dashboard/veterinario")
    public String veterinarioDashboard(Authentication auth, Model model) {
        addUserInfo(auth, model);
        return "dashboards/veterinario";
    }

    @GetMapping({"/dashboard/paseador", "/dashboard/peluquero", "/dashboard/adiestrador", "/dashboard/cuidador"})
    public String profesionalDashboard(Authentication auth, Model model) {
        addUserInfo(auth, model);
        return "dashboards/profesional";
    }

    private void addUserInfo(Authentication auth, Model model) {
        if (auth != null) {
            usuarioRepository.findByEmail(auth.getName()).ifPresent(u -> {
                model.addAttribute("usuario", u);
                model.addAttribute("nombre", u.getNombre());
                model.addAttribute("rol", u.getRol().name());
                if (u instanceof Profesional p) {
                    model.addAttribute("estadoProfesional", p.getEstado().name());
                }
            });
        }
    }
}
