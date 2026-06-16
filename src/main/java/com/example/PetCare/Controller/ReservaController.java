package com.example.PetCare.Controller;

import com.example.PetCare.Service.CuidadorService;
import com.example.PetCare.Service.MascotaService;
import com.example.PetCare.Service.ReservaService;
import com.example.PetCare.model.Reserva;
import com.example.PetCare.model.RolUsuario;
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
@RequestMapping("/reservas")
public class ReservaController {

    private final ReservaService reservaService;
    private final MascotaService mascotaService;
    private final CuidadorService cuidadorService;

    public ReservaController(ReservaService reservaService, MascotaService mascotaService, CuidadorService cuidadorService) {
        this.reservaService = reservaService;
        this.mascotaService = mascotaService;
        this.cuidadorService = cuidadorService;
    }

    @GetMapping
    public String listar(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/";

        List<Reserva> reservas = switch (usuario.getRol().name().toLowerCase()) {
            case "administrador", "dueno" -> reservaService.listarTodas();
            case "cuidador" -> reservaService.listarPorCuidador(usuario.getIdUsuario());
            default -> reservaService.listarPorUsuario(usuario.getIdUsuario());
        };

        model.addAttribute("reservas", reservas);
        model.addAttribute("usuario", usuario);
        return "gestor-reservas";
    }

    @GetMapping("/nueva")
    public String mostrarFormulario(
            HttpSession session,
            Model model,
            @RequestParam(required = false) Integer cuidadorId,
            @RequestParam(required = false) String servicio
    ) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/";

        // El DUENO solo puede ver listados, no crear reservas
        if (usuario.getRol() == RolUsuario.DUENO) {
            return "redirect:/reservas";
        }

        model.addAttribute("mascotas", mascotaService.listarPorUsuario(usuario.getIdUsuario()));
        model.addAttribute("cuidadores", cuidadorService.listarDisponibles());
        model.addAttribute("reserva", new Reserva());
        model.addAttribute("cuidadorId", cuidadorId);
        model.addAttribute("servicio", servicio);
        return "reservar";
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute Reserva reserva, HttpSession session, RedirectAttributes redirectAttributes) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/";

        // El DUENO solo puede ver listados, no crear reservas
        if (usuario.getRol() == RolUsuario.DUENO) {
            return "redirect:/reservas";
        }

        reserva.setIdUsuario(usuario.getIdUsuario());
        reserva.setEstado("PENDIENTE");

        if (reservaService.crear(reserva)) {
            redirectAttributes.addFlashAttribute("mensaje", "Reserva creada exitosamente");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se pudo crear la reserva");
        }
        return "redirect:/reservas";
    }

    @PostMapping("/confirmar/{id}")
    public String confirmar(@PathVariable Integer id, HttpSession session, RedirectAttributes redirectAttributes) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || usuario.getRol() == RolUsuario.DUENO) return "redirect:/reservas";

        if (reservaService.confirmar(id)) {
            redirectAttributes.addFlashAttribute("mensaje", "Reserva confirmada");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se pudo confirmar la reserva");
        }
        return "redirect:/reservas";
    }

    @PostMapping("/cancelar/{id}")
    public String cancelar(@PathVariable Integer id, HttpSession session, RedirectAttributes redirectAttributes) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || usuario.getRol() == RolUsuario.DUENO) return "redirect:/reservas";

        if (reservaService.cancelar(id)) {
            redirectAttributes.addFlashAttribute("mensaje", "Reserva cancelada");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se pudo cancelar la reserva");
        }
        return "redirect:/reservas";
    }

    @PostMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Integer id, HttpSession session, RedirectAttributes redirectAttributes) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || usuario.getRol() == RolUsuario.DUENO) return "redirect:/reservas";

        if (reservaService.eliminar(id)) {
            redirectAttributes.addFlashAttribute("mensaje", "Reserva eliminada");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se pudo eliminar la reserva");
        }
        return "redirect:/reservas";
    }

    @GetMapping("/api")
    @ResponseBody
    public List<Reserva> apiListar() {
        return reservaService.listarTodas();
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<Reserva> apiBuscar(@PathVariable Integer id) {
        return reservaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity<String> apiCrear(@RequestBody Reserva reserva) {
        boolean creado = reservaService.crear(reserva);
        if (creado) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Reserva creada correctamente");
        }
        return ResponseEntity.badRequest().body("No se pudo crear la reserva");
    }
}
