package com.example.PetCare.service;

import com.example.PetCare.model.Carrito;
import com.example.PetCare.model.CarritoProducto;
import com.example.PetCare.model.Producto;
import com.example.PetCare.repository.CarritoProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CarritoProductoService {
    private final CarritoProductoRepository carritoProductoRepository;
    private final ProductoService productoService;

    public CarritoProducto obtenerOCrearItem(Carrito carrito, Producto producto){
        return carrito.getItems().stream()
                .filter(i -> i.getProducto().getId() == producto.getId())
                .findFirst()
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
