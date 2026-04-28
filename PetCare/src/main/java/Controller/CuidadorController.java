package Controller;


import model.Cuidador;
import Service.CuidadorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuidadores")
public class CuidadorController {

    private final CuidadorService cuidadorService;

    public CuidadorController(CuidadorService cuidadorService) {
        this.cuidadorService = cuidadorService;
    }

    @GetMapping
    public List<Cuidador> listarTodos() {
        return cuidadorService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cuidador> buscarPorId(@PathVariable Integer id) {
        return cuidadorService.buscarPorId(id)
                .map(cuidador -> ResponseEntity.ok(cuidador))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> crear(@RequestBody Cuidador cuidador) {
        boolean creado = cuidadorService.crear(cuidador);

        if (creado) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Cuidador creado correctamente");
        }

        return ResponseEntity.badRequest().body("No se pudo crear el cuidador");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> actualizar(@PathVariable Integer id,
                                             @RequestBody Cuidador cuidador) {
        boolean actualizado = cuidadorService.actualizar(id, cuidador);

        if (actualizado) {
            return ResponseEntity.ok("Cuidador actualizado correctamente");
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        boolean eliminado = cuidadorService.eliminar(id);

        if (eliminado) {
            return ResponseEntity.ok("Cuidador eliminado correctamente");
        }

        return ResponseEntity.notFound().build();
    }
}