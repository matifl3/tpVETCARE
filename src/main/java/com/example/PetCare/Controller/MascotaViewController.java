package com.example.PetCare.Controller;

import com.example.PetCare.Service.MascotaService;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.RolUsuario;
import com.example.PetCare.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class MascotaViewController {

    private final MascotaService service;

    public MascotaViewController(MascotaService service) {
        this.service = service;
    }

    /*
     * Lista las mascotas.
     * Para ADMINISTRADOR y DUENO: muestra todas las mascotas del sistema.
     * Para otros roles: solo las mascotas del usuario logueado.
     * DUENO ve la lista sin botones de agregar/eliminar.
     * Agrega el rol al modelo para que la vista sepa qué mostrar.
     */
    @GetMapping("/mascotas")
    public String listar(HttpSession session, Model model) {
        // Verifica sesion activa
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/";

        // ADMIN y DUENO ven todas las mascotas; el resto solo las suyas
        if (usuario.getRol() == RolUsuario.ADMINISTRADOR || usuario.getRol() == RolUsuario.DUENO) {
            model.addAttribute("mascotas", service.listarTodos());
        } else {
            model.addAttribute("mascotas", service.listarPorUsuario(usuario.getIdUsuario()));
        }

        // Pasa el rol a la vista para controlar visibilidad de botones
        model.addAttribute("rolUsuario", usuario.getRol().name());

        return "lista-mascotas";
    }

    /*
     * Muestra el formulario para agregar una nueva mascota.
     * El DUENO no puede agregar mascotas (solo visualizar).
     * Bloquea el acceso redirigiendo al listado si el rol es DUENO.
     */
    @GetMapping("/agregarMascota")
    public String mostrarFormulario(HttpSession session, Model model) {
        // Verifica sesion activa
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/";

        // El DUENO solo puede ver mascotas, no agregar
        if (usuario.getRol() == RolUsuario.DUENO) {
            return "redirect:/mascotas";
        }

        model.addAttribute("mascota", new Mascota());
        return "agregarMascota";
    }

    /*
     * Guarda una nueva mascota en la base de datos.
     * Asigna automaticamente el id del usuario logueado como dueno de la mascota.
     * El DUENO no puede ejecutar esta accion (redirige al listado).
     */
    @PostMapping("/guardarMascota")
    public String guardar(Mascota mascota, HttpSession session, RedirectAttributes redirectAttributes) {
        // Verifica sesion activa
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/";

        // El DUENO solo puede ver mascotas, no agregar
        if (usuario.getRol() == RolUsuario.DUENO) {
            return "redirect:/mascotas";
        }

        // Asigna el dueno de la mascota y persiste
        mascota.setIdUsuario(usuario.getIdUsuario());
        if (service.guardar(mascota)) {
            redirectAttributes.addFlashAttribute("mensaje", "Mascota registrada exitosamente");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se pudo registrar la mascota");
        }
        return "redirect:/mascotas";
    }

    /*
     * Elimina una mascota por ID.
     * El DUENO no puede ejecutar esta accion.
     */
    @PostMapping("/mascotas/eliminar/{id}")
    public String eliminar(
            @PathVariable Integer id,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        // Verifica sesion activa
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/";

        // El DUENO solo puede ver mascotas, no eliminar
        if (usuario.getRol() == RolUsuario.DUENO) {
            return "redirect:/mascotas";
        }

        // Elimina la mascota
        if (service.eliminar(id)) {
            redirectAttributes.addFlashAttribute("mensaje", "Mascota eliminada");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se pudo eliminar la mascota");
        }
        return "redirect:/mascotas";
    }
}
