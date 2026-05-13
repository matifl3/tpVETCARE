package com.example.PetCare.Controller;

import com.example.PetCare.Service.UsuarioService;
import com.example.PetCare.model.Usuario;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class HomeController {

    private final UsuarioService usuarioService;

    public HomeController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/")
    public String inicio() {
        return "index";
    }

    @PostMapping("/login")
    public String login(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String rol,
            RedirectAttributes redirectAttributes
    ) {
        // TODO: implementar autenticación real
        redirectAttributes.addFlashAttribute("mensaje", "Inicio de sesión exitoso");
        return "redirect:/dashboard/" + rol;
    }

    @PostMapping("/register")
    public String register(
            @RequestParam String nombre,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String rol,
            RedirectAttributes redirectAttributes
    ) {
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        // TODO: guardar contraseña y rol cuando el modelo los soporte

        boolean creado = usuarioService.crear(usuario);
        if (creado) {
            redirectAttributes.addFlashAttribute("mensaje", "Registro exitoso. Ahora puedes iniciar sesión.");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se pudo registrar el usuario.");
        }
        return "redirect:/";
    }

    @GetMapping("/dashboard/dueno")
    public String dashboardDueno() {
        return "dashboard-dueno";
    }

    @GetMapping("/dashboard/usuario")
    public String dashboardUsuario() {
        return "dashboard-usuario";
    }

    @GetMapping("/dashboard/veterinario")
    public String dashboardVeterinario() {
        return "dashboard-veterinario";
    }
}
