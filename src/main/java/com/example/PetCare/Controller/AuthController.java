package com.example.PetCare.Controller;

import com.example.PetCare.Service.AuthService;
import com.example.PetCare.model.RolUsuario;
import com.example.PetCare.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /*
     * Página de inicio pública.
     * Muestra el home de PetCare con hero, servicios, login/registro y
     * la seccion "Trabaja con nosotros".
     */
    @GetMapping("/")
    public String inicio() {
        return "index";
    }

    /*
     * Registra un usuario común desde el formulario público de index.html.
     * Recibe nombre, apellido, email, password, confirmPassword y rol.
     * Valida que password y confirmacion coincidan antes de delegar en AuthService.
     * Solo permite crear usuarios con rol USUARIO (el front ya envia rol=usuario oculto).
     */
    @PostMapping("/register")
    public String register(
            @RequestParam String nombre,
            @RequestParam String apellido,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String confirmPassword,
            @RequestParam String rol,
            RedirectAttributes redirectAttributes
    ) {
        // Verifica que las contraseñas coincidan
        if (!password.equals(confirmPassword)) {
            redirectAttributes.addFlashAttribute("errorRegistro", "Las contraseñas no coinciden");
            return "redirect:/#auth";
        }

        try {
            // Convierte el string del rol a enum y registra
            RolUsuario rolEnum = mapRol(rol);
            authService.registrar(nombre, apellido, email, password, rolEnum);
            redirectAttributes.addFlashAttribute("mensaje", "Registro exitoso. Ahora puedes iniciar sesión.");
            return "redirect:/";
        } catch (IllegalArgumentException e) {
            // Captura errores de validacion (email duplicado, rol invalido)
            redirectAttributes.addFlashAttribute("errorRegistro", e.getMessage());
            return "redirect:/#auth";
        }
    }

    /*
     * Inicia sesion.
     * Recibe email, password y rol seleccionado. Verifica credenciales.
     * Si el usuario debe cambiar la password (profesional nuevo), redirige a
     * /cambiar-password. Sino, redirige al dashboard segun su rol.
     */
    @PostMapping("/login")
    public String login(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String rol,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        try {
            // Autentica al usuario
            RolUsuario rolEnum = mapRol(rol);
            Usuario usuario = authService.autenticar(email, password, rolEnum);
            session.setAttribute("usuario", usuario);

            // Si es profesional nuevo con password default, obliga a cambiar
            if (usuario.isDebeCambiarPassword()) {
                return "redirect:/cambiar-password";
            }

            // Redirige al dashboard correspondiente al rol
            String dashboardUrl = switch (usuario.getRol()) {
                case USUARIO -> "/dashboard/usuario";
                case ADMINISTRADOR -> "/dashboard/administrador";
                case DUENO -> "/dashboard/dueno";
                case VETERINARIO -> "/dashboard/veterinario";
                case PASEADOR -> "/dashboard/paseador";
                case PELUQUERO -> "/dashboard/peluquero";
                case ADIESTRADOR -> "/dashboard/adiestrador";
                case CUIDADOR -> "/dashboard/cuidador";
            };
            return "redirect:" + dashboardUrl;
        } catch (IllegalArgumentException e) {
            // Error de autenticacion (credenciales invalidas)
            redirectAttributes.addFlashAttribute("errorLogin", e.getMessage());
            return "redirect:/#auth";
        }
    }

    /*
     * Cierra la sesion del usuario actual invalidando la sesion HTTP.
     */
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    /*
     * Vista de depuracion para verificar el estado de la sesion activa.
     */
    @GetMapping("/sesion")
    public String verSesion(HttpSession session, org.springframework.ui.Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            model.addAttribute("logueado", true);
            model.addAttribute("nombre", usuario.getNombre() + " " + usuario.getApellido());
            model.addAttribute("email", usuario.getEmail());
            model.addAttribute("rol", usuario.getRol());
            model.addAttribute("dashboardUrl", switch (usuario.getRol()) {
                case USUARIO -> "/dashboard/usuario";
                case ADMINISTRADOR -> "/dashboard/administrador";
                case DUENO -> "/dashboard/dueno";
                case VETERINARIO -> "/dashboard/veterinario";
                case PASEADOR -> "/dashboard/paseador";
                case PELUQUERO -> "/dashboard/peluquero";
                case ADIESTRADOR -> "/dashboard/adiestrador";
                case CUIDADOR -> "/dashboard/cuidador";
            });
            model.addAttribute("activo", usuario.isActivo());
        } else {
            model.addAttribute("logueado", false);
        }
        return "sesion";
    }

    /*
     * Muestra el formulario de cambio de password obligatorio.
     * Solo accesible si el usuario esta logueado y tiene debeCambiarPassword=true.
     */
    @GetMapping("/cambiar-password")
    public String mostrarCambiarPassword(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !usuario.isDebeCambiarPassword()) {
            return "redirect:/";
        }
        return "cambiar-password";
    }

    /*
     * Procesa el cambio de password obligatorio.
     * Valida que la nueva password y su confirmacion coincidan,
     * actualiza en BD y desactiva debeCambiarPassword.
     */
    @PostMapping("/cambiar-password")
    public String procesarCambiarPassword(
            @RequestParam String nuevaPassword,
            @RequestParam String confirmarPassword,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !usuario.isDebeCambiarPassword()) {
            return "redirect:/";
        }

        // Validaciones basicas
        if (!nuevaPassword.equals(confirmarPassword)) {
            redirectAttributes.addFlashAttribute("error", "Las contraseñas no coinciden");
            return "redirect:/cambiar-password";
        }
        if (nuevaPassword.length() < 6) {
            redirectAttributes.addFlashAttribute("error", "La contraseña debe tener al menos 6 caracteres");
            return "redirect:/cambiar-password";
        }

        // Guarda la nueva password y actualiza la sesion
        authService.cambiarPassword(usuario, nuevaPassword);
        Usuario usuarioActualizado = authService.autenticar(usuario.getEmail(), nuevaPassword, usuario.getRol());
        session.setAttribute("usuario", usuarioActualizado);

        // Redirige al dashboard segun el rol
        String dashboardUrl = switch (usuarioActualizado.getRol()) {
            case USUARIO -> "/dashboard/usuario";
            case ADMINISTRADOR -> "/dashboard/administrador";
            case DUENO -> "/dashboard/dueno";
            case VETERINARIO -> "/dashboard/veterinario";
            case PASEADOR -> "/dashboard/paseador";
            case PELUQUERO -> "/dashboard/peluquero";
            case ADIESTRADOR -> "/dashboard/adiestrador";
            case CUIDADOR -> "/dashboard/cuidador";
        };
        return "redirect:" + dashboardUrl;
    }

    // ==================== DASHBOARDS ====================

    /*
     * Cada metodo dashboard verifica que haya un usuario en sesion
     * y retorna la vista correspondiente al rol.
     */

    @GetMapping("/dashboard/administrador")
    public String dashboardAdministrador(HttpSession session) {
        if (session.getAttribute("usuario") == null) {
            return "redirect:/";
        }
        return "dashboard-administrador";
    }

    @GetMapping("/dashboard/dueno")
    public String dashboardDueno(HttpSession session) {
        if (session.getAttribute("usuario") == null) {
            return "redirect:/";
        }
        return "dashboard-dueno";
    }

    @GetMapping("/dashboard/veterinario")
    public String dashboardVeterinario(HttpSession session) {
        if (session.getAttribute("usuario") == null) {
            return "redirect:/";
        }
        return "dashboard-veterinario";
    }

    @GetMapping("/dashboard/paseador")
    public String dashboardPaseador(HttpSession session) {
        if (session.getAttribute("usuario") == null) {
            return "redirect:/";
        }
        return "dashboard-paseador";
    }

    @GetMapping("/dashboard/peluquero")
    public String dashboardPeluquero(HttpSession session) {
        if (session.getAttribute("usuario") == null) {
            return "redirect:/";
        }
        return "dashboard-peluquero";
    }

    @GetMapping("/dashboard/adiestrador")
    public String dashboardAdiestrador(HttpSession session) {
        if (session.getAttribute("usuario") == null) {
            return "redirect:/";
        }
        return "dashboard-adiestrador";
    }

    @GetMapping("/dashboard/cuidador")
    public String dashboardCuidador(HttpSession session) {
        if (session.getAttribute("usuario") == null) {
            return "redirect:/";
        }
        return "dashboard-cuidador";
    }

    @GetMapping("/dashboard/usuario")
    public String dashboardUsuario(HttpSession session) {
        if (session.getAttribute("usuario") == null) {
            return "redirect:/";
        }
        return "dashboard-usuario";
    }

    // ==================== ACCIONES DE ROLES ====================

    /*
     * Crea un usuario ADMINISTRADOR.
     * Solo el DUENO puede ejecutar esta accion desde su dashboard.
     * Envuelve toda la operacion en try-catch para capturar cualquier
     * excepcion inesperada (ej. error de BD) y mostrarla en el front
     * en vez de devolver pagina 500.
     */
    @PostMapping("/dashboard/dueno/crear-admin")
    public String dashboardDuenoCrearAdmin(
            HttpSession session,
            String nombre,
            String apellido,
            String email,
            String password,
            RedirectAttributes redirectAttributes
    ) {
        try {
            // Verifica que el usuario logueado sea DUENO
            Usuario usuarioSesion = (Usuario) session.getAttribute("usuario");
            if (usuarioSesion == null || usuarioSesion.getRol() != RolUsuario.DUENO) {
                return "redirect:/";
            }

            // Crea el administrador (retorna null si el email ya existe)
            Usuario nuevoAdmin = authService.crearAdministrador(nombre, apellido, email, password);
            if (nuevoAdmin != null) {
                redirectAttributes.addFlashAttribute("exito", "Administrador creado exitosamente");
            } else {
                redirectAttributes.addFlashAttribute("errorMsg", "El email ya está registrado en el sistema");
            }
        } catch (Exception e) {
            // Captura CUALQUIER excepcion (no solo IllegalArgumentException)
            // y la muestra al usuario para que pueda reportar el error.
            // Esto evita la pagina 500 (Whitelabel Error Page).
            redirectAttributes.addFlashAttribute("errorMsg",
                    "Error inesperado: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }

        return "redirect:/dashboard/dueno";
    }

    /*
     * Crea un usuario DUENO.
     * Solo el ADMINISTRADOR puede ejecutar esta accion desde su dashboard.
     * Misma proteccion con try-catch para evitar pagina 500.
     */
    @PostMapping("/dashboard/administrador/crear-dueno")
    public String dashboardAdminCrearDueno(
            HttpSession session,
            String nombre,
            String apellido,
            String email,
            String password,
            RedirectAttributes redirectAttributes
    ) {
        try {
            // Verifica que el usuario logueado sea ADMINISTRADOR
            Usuario usuarioSesion = (Usuario) session.getAttribute("usuario");
            if (usuarioSesion == null || usuarioSesion.getRol() != RolUsuario.ADMINISTRADOR) {
                return "redirect:/";
            }

            // Crea el dueno (retorna null si el email ya existe)
            Usuario nuevoDueno = authService.crearDueno(nombre, apellido, email, password);
            if (nuevoDueno != null) {
                redirectAttributes.addFlashAttribute("exito", "Dueño creado exitosamente");
            } else {
                redirectAttributes.addFlashAttribute("errorMsg", "El email ya está registrado en el sistema");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMsg",
                    "Error inesperado: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }

        return "redirect:/dashboard/administrador";
    }

    /*
     * Convierte un string de rol (enviado desde formulario) al enum RolUsuario.
     * Acepta variantes como "duenio" y "dueñio" para el rol DUENO.
     */
    private RolUsuario mapRol(String rol) {
        return switch (rol.toLowerCase()) {
            case "usuario" -> RolUsuario.USUARIO;
            case "administrador" -> RolUsuario.ADMINISTRADOR;
            case "dueno" -> RolUsuario.DUENO;
            case "duenio" -> RolUsuario.DUENO;
            case "dueñio" -> RolUsuario.DUENO;
            case "veterinario" -> RolUsuario.VETERINARIO;
            case "paseador" -> RolUsuario.PASEADOR;
            case "peluquero" -> RolUsuario.PELUQUERO;
            case "adiestrador" -> RolUsuario.ADIESTRADOR;
            case "cuidador" -> RolUsuario.CUIDADOR;
            default -> throw new IllegalArgumentException("Rol inválido");
        };
    }

}
