package com.example.PetCare.service;

import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Carrito;
import com.example.PetCare.model.CarritoProducto;
import com.example.PetCare.model.Producto;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CarritoProductoService {

    /**
     * Metodo que busca un producto específico dentro de la lista de productos del carrito.
     */
    private Optional<CarritoProducto> buscarProducto(Carrito carrito, Producto producto){
        return carrito.getItems().stream()
                .filter(i -> i.getProducto().getId() == producto.getId())
                .findFirst();
    }

    /**
     * Obtiene el producto en el carrito. Si el producto no pertenece al carrito, lanza una excepción de no encontrado.
     */
    public CarritoProducto obtenerProducto(Carrito carrito, Producto producto){
        return buscarProducto(carrito, producto)
                .orElseThrow(() -> new NoEncontradoException("Producto no encontrado en el carrito"));
    }

    /**
     * Modifica de forma directa la cantidad de un producto que ya existe dentro del carrito.
     */
    public void modificarCantidad(Carrito carrito, Producto producto, int cantidad){
        obtenerProducto(carrito, producto).setCantidad(cantidad);
    }

    /**
     * Busca un producto en el carrito. Si ya existe, lo retorna; si no existe,
     * crea una nueva instancia de CarritoProducto y lo agrega al carrito antes de retornarlo.
     */
    public CarritoProducto obtenerOCrearItem(Carrito carrito, Producto producto){
        return buscarProducto(carrito, producto)
                .orElseGet(() -> {
                    CarritoProducto nuevoProducto = new CarritoProducto();
                    nuevoProducto.setCarrito(carrito);
                    nuevoProducto.setProducto(producto);
                    nuevoProducto.setCantidad(0);
                    nuevoProducto.setPrecioUnitario(producto.getPrecio());
                    carrito.getItems().add(nuevoProducto);
                    return nuevoProducto;
                });
    }
}
