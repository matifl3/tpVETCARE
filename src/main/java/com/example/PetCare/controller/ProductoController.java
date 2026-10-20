package com.example.PetCare.controller;

import com.example.PetCare.model.Producto;
import com.example.PetCare.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // Listar productos: cualquier usuario autenticado puede ver el catálogo (es información pública)
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

    // Crear producto: solo ADMIN (gestión de inventario)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Producto crear(@RequestBody @Valid Producto producto) {
        return productoService.crear(producto);
    }

    // Actualizar producto: solo ADMIN (gestión de inventario)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Producto actualizar(@PathVariable Integer id, @RequestBody @Valid Producto producto) {
        producto.setId(id);
        return productoService.actualizar(producto);
    }

    // Eliminar producto: solo ADMIN (operación destructiva)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Integer id) {
        productoService.eliminar(id);
    }

    // Stock bajo: solo ADMIN y PROFESIONALES (vista de gestión)
    @GetMapping("/stock/bajo")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO')")
    public List<Producto> listarStockBajo() {
        return productoService.findByStockBefore();
    }
}
