package com.example.PetCare.Controller;

import com.example.PetCare.Service.UsuarioService;
import com.example.PetCare.model.RolUsuario;
import com.example.PetCare.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/usuarios")
public class UsuarioViewController {

    private final UsuarioService usuarioService;

    public UsuarioViewController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public String listar(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || usuario.getRol() != RolUsuario.ADMINISTRADOR) {
            return "redirect:/";
        }
        model.addAttribute("usuarios", usuarioService.listarTodos());
        return "lista-usuarios";
    }

    @PostMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Integer id, RedirectAttributes redirectAttributes) {
        if (usuarioService.eliminarLogico(id)) {
            redirectAttributes.addFlashAttribute("mensaje", "Usuario desactivado correctamente");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se pudo desactivar el usuario");
        }
        return "redirect:/admin/usuarios";
    }
}
