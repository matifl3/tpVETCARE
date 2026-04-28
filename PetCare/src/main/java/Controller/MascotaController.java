package Controller;

import model.Mascota;
import Service.MascotaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    private final MascotaService mascotaService;

    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    /*
     * GET http://localhost:8080/api/mascotas
     */
    @GetMapping
    public List<Mascota> listarTodos() {
        return mascotaService.listarTodos();
    }

    /*
     * GET http://localhost:8080/api/mascotas/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<Mascota> buscarPorId(@PathVariable Integer id) {
        return mascotaService.buscarPorId(id)
                .map(mascota -> ResponseEntity.ok(mascota))
                .orElse(ResponseEntity.notFound().build());
    }

    /*
     * POST http://localhost:8080/api/mascotas
     */
    @PostMapping
    public ResponseEntity<String> crear(@RequestBody Mascota mascota) {
        boolean creado = mascotaService.crear(mascota);

        if (creado) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Mascota creada correctamente");
        }

        return ResponseEntity.badRequest().body("No se pudo crear la mascota");
    }

    /*
     * PUT http://localhost:8080/api/mascotas/1
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> actualizar(
            @PathVariable Integer id,
            @RequestBody Mascota mascota
    ) {
        boolean actualizado = mascotaService.actualizar(id, mascota);

        if (actualizado) {
            return ResponseEntity.ok("Mascota actualizada correctamente");
        }

        return ResponseEntity.notFound().build();
    }

    /*
     * DELETE http://localhost:8080/api/mascotas/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        boolean eliminado = mascotaService.eliminar(id);

        if (eliminado) {
            return ResponseEntity.ok("Mascota eliminada correctamente");
        }

        return ResponseEntity.notFound().build();
    }
}