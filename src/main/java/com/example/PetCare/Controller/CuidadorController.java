package com.example.PetCare.Controller;

import com.example.PetCare.Service.CuidadorService;
import com.example.PetCare.model.Cuidador;
import com.example.PetCare.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/cuidadores")
public class CuidadorController {

    private final CuidadorService cuidadorService;

    public CuidadorController(CuidadorService cuidadorService) {
        this.cuidadorService = cuidadorService;
    }

    @GetMapping
    public String listar(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/";

        model.addAttribute("cuidadores", cuidadorService.listarTodos());
        model.addAttribute("disponibles", cuidadorService.listarDisponibles());
        return "lista-cuidadores";
    }

    @GetMapping("/nuevo")
    public String mostrarFormulario(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/";

        model.addAttribute("cuidador", new Cuidador());
        return "formulario-cuidador";
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute Cuidador cuidador, RedirectAttributes redirectAttributes) {
        if (cuidadorService.crear(cuidador)) {
            redirectAttributes.addFlashAttribute("mensaje", "Cuidador registrado exitosamente");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se pudo registrar el cuidador");
        }
        return "redirect:/cuidadores";
    }

    @PostMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Integer id, RedirectAttributes redirectAttributes) {
        if (cuidadorService.eliminar(id)) {
            redirectAttributes.addFlashAttribute("mensaje", "Cuidador eliminado");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se pudo eliminar el cuidador");
        }
        return "redirect:/cuidadores";
    }

    @GetMapping("/api")
    @ResponseBody
    public List<Cuidador> apiListar() {
        return cuidadorService.listarTodos();
    }

    @GetMapping("/api/disponibles")
    @ResponseBody
    public List<Cuidador> apiListarDisponibles() {
        return cuidadorService.listarDisponibles();
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<Cuidador> apiBuscar(@PathVariable Integer id) {
        return cuidadorService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity<String> apiCrear(@RequestBody Cuidador cuidador) {
        boolean creado = cuidadorService.crear(cuidador);
        if (creado) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Cuidador creado correctamente");
        }
        return ResponseEntity.badRequest().body("No se pudo crear el cuidador");
    }
}
