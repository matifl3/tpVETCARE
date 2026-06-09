package com.example.PetCare.service;

import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Producto;
import com.example.PetCare.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
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

    public List<Producto> findByPrecioBefore(double precioBefore) {
        return productoRepository.findByPrecioBefore(precioBefore);
    }

    public List<Producto> findByPrecioAfter(double precioAfter) {
        return productoRepository.findByPrecioAfter(precioAfter);
    }

    public List<Producto> findByActivo(boolean activo) {
        return productoRepository.findByActivo(activo);
    }

    /// AbM
    public Producto crear(Producto producto) {
        return productoRepository.save(producto);
    }

    public Producto actualizar(Producto producto) {
        if(!productoRepository.existsById(producto.getId())){
            throw new NoEncontradoException("No existe el producto");
        }
        return productoRepository.save(producto);
    }

    public void eliminar(Integer id) {
        productoRepository.deleteById(id);
    }

    public Producto sumaStock(Integer id,int stock){
        Producto producto= productoRepository.findById(id)
                .orElseThrow(()->new NoEncontradoException("No existe el producto"));
        producto.setStock(producto.getStock()+stock);
        return productoRepository.save(producto);
    }

    public Producto restaStock(Integer id,int stock){
        Producto producto= productoRepository.findById(id)
                .orElseThrow(()->new NoEncontradoException("No existe el producto"));
        if(producto.getStock()<stock){
            throw new IllegalArgumentException("No hay suficiente stock disponible");
        }
        producto.setStock(producto.getStock()-stock);
        return productoRepository.save(producto);
    }

    public List<Producto> findByStockBefore() {
        return productoRepository.findByStockBefore(10);
    }

    /**
     * Valida que el producto esté activo y que tenga stock suficiente para la venta. Si alguna de las condiciones no se cumple, lanza una excepción de no encontrado.
     */
    public void validarProducto(Producto producto, int cantidadRequerida){
        if(!producto.isActivo()) {
            throw new NoEncontradoException("Producto no disponible");
        }
        if(producto.getStock() < cantidadRequerida) {
            throw new NoEncontradoException("Stock insuficiente");
        }
    }
}
