package com.example.PetCare.service;

import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Producto;
import com.example.PetCare.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductoService {
    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    /// Listas
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    public Producto listarPorid(Integer id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("No existe el producto"));
    }

    public List<Producto> listaXcategoria(String categoria) {
        return productoRepository.findByCategoria(categoria);
    }

    public List<Producto> findByNombre(String nombre) {
        return productoRepository.findByNombre(nombre);
    }

    public List<Producto> findByPrecioBefore(Double precio) {
        return productoRepository.findByPrecioLessThan(precio);
    }

    public List<Producto> findByPrecioAfter(Double precio) {
        return productoRepository.findByPrecioGreaterThan(precio);
    }

    public List<Producto> findByActivo(Boolean activo) {
        return productoRepository.findByActivo(activo);
    }

    public List<Producto> findByStockBefore() {
        return productoRepository.findByStockLessThan(10);
    }

    /// AbM
    public Producto crear(Producto producto) {
        if (productoRepository.existsByNombreIgnoreCase(producto.getNombre())) {
            throw new IllegalArgumentException("Ya existe un producto con el nombre: " + producto.getNombre());
        }
        return productoRepository.save(producto);
    }

    public Producto actualizar(Producto dto) {
        Producto producto = productoRepository.findById(dto.getId())
                .orElseThrow(() -> new NoEncontradoException("No existe el producto"));

        if (dto.getNombre() != null) producto.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) producto.setDescripcion(dto.getDescripcion());
        if (dto.getPrecio() != null) producto.setPrecio(dto.getPrecio());
        if (dto.getStock() != null) producto.setStock(dto.getStock());
        if (dto.getCategoria() != null) producto.setCategoria(dto.getCategoria());
        if (dto.getActivo() != null) producto.setActivo(dto.getActivo());

        return productoRepository.save(producto);
    }

    public void eliminar(Integer id) {
        productoRepository.deleteById(id);
    }

    public Producto sumaStock(Integer id, int stock) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("No existe el producto"));
        producto.setStock(producto.getStock() != null ? producto.getStock() + stock : stock);
        return productoRepository.save(producto);
    }

    public Producto restaStock(Integer id, int stock) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("No existe el producto"));
        if (producto.getStock() == null || producto.getStock() < stock) {
            throw new IllegalArgumentException("No hay suficiente stock disponible");
        }
        producto.setStock(producto.getStock() - stock);
        return productoRepository.save(producto);
    }

    public void validarProducto(Producto producto, int cantidadRequerida) {
        if (!Boolean.TRUE.equals(producto.getActivo())) {
            throw new NoEncontradoException("Producto no disponible");
        }
        if (producto.getStock() == null || producto.getStock() < cantidadRequerida) {
            throw new NoEncontradoException("Stock insuficiente");
        }
    }
}
