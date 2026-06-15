package com.example.PetCare.controller;

import com.example.PetCare.model.Producto;
import com.example.PetCare.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<Producto> listarTodos() {
        return productoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Producto listarPorId(@PathVariable Integer id) {
        return productoService.listarPorid(id);
    }

    @GetMapping("/categoria/{categoria}")
    public List<Producto> listarPorCategoria(@PathVariable String categoria) {
        return productoService.listaXcategoria(categoria);
    }

    @GetMapping("/nombre/{nombre}")
    public List<Producto> buscarPorNombre(@PathVariable String nombre) {
        return productoService.findByNombre(nombre);
    }

    @GetMapping("/precio/antes/{precio}")
    public List<Producto> listarPrecioAntesDe(@PathVariable Double precio) {
        return productoService.findByPrecioBefore(precio);
    }

    @GetMapping("/precio/despues/{precio}")
    public List<Producto> listarPrecioDespuesDe(@PathVariable Double precio) {
        return productoService.findByPrecioAfter(precio);
    }

    @GetMapping("/activos/{activo}")
    public List<Producto> listarPorActivo(@PathVariable Boolean activo) {
        return productoService.findByActivo(activo);
    }

    @PostMapping
    public Producto crear(@RequestBody @Valid Producto producto) {
        return productoService.crear(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Integer id, @RequestBody @Valid Producto producto) {
        producto.setId(id);
        return productoService.actualizar(producto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        productoService.eliminar(id);
    }

    @GetMapping("/stock/bajo")
    public List<Producto> listarStockBajo() {
        return productoService.findByStockBefore();
    }
}
