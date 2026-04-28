package Controller;


import model.Usuario;
import Service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /*
     * GET http://localhost:8080/api/usuarios
     */
    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioService.listarTodos();
    }

    /*
     * GET http://localhost:8080/api/usuarios/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarPorId(id)
                .map(usuario -> ResponseEntity.ok(usuario))
                .orElse(ResponseEntity.notFound().build());
    }

    /*
     * POST http://localhost:8080/api/usuarios
     */
    @PostMapping
    public ResponseEntity<String> crear(@RequestBody Usuario usuario) {
        boolean creado = usuarioService.crear(usuario);

        if (creado) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuario creado correctamente");
        }

        return ResponseEntity.badRequest().body("No se pudo crear el usuario");
    }

    /*
     * PUT http://localhost:8080/api/usuarios/1
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> actualizar(
            @PathVariable Integer id,
            @RequestBody Usuario usuario
    ) {
        boolean actualizado = usuarioService.actualizar(id, usuario);

        if (actualizado) {
            return ResponseEntity.ok("Usuario actualizado correctamente");
        }

        return ResponseEntity.notFound().build();
    }

    /*
     * DELETE http://localhost:8080/api/usuarios/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarLogico(@PathVariable Integer id) {
        boolean eliminado = usuarioService.eliminarLogico(id);

        if (eliminado) {
            return ResponseEntity.ok("Usuario eliminado correctamente");
        }

        return ResponseEntity.notFound().build();
    }
}