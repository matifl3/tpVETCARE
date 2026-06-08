package com.example.PetCare.service;

import com.example.PetCare.dto.CarritoDTO;
import com.example.PetCare.dto.CarritoProductoDTO;
import com.example.PetCare.enums.Estado_Carrito;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Carrito;
import com.example.PetCare.model.CarritoProducto;
import com.example.PetCare.model.Producto;
import com.example.PetCare.repository.CarritoRepository;
import com.example.PetCare.repository.ProductoRepository;
import com.example.PetCare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarritoService {
    private final CarritoRepository carritoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoService productoService;
    private final CarritoProductoService carritoProductoService;

    public Carrito obtenerOCrearCarrito(int idUsuario) {
        Carrito carritoExistente = carritoRepository.findByIdUsuarioAndEstado(idUsuario, Estado_Carrito.CARRITO);
        if(carritoExistente != null) {
            return carritoExistente;
        }else {
            Carrito carrito = new Carrito();
            carrito.setUsuario(usuarioRepository.findById(idUsuario).
                    orElseThrow(() -> new NoEncontradoException("Usuario no encontrado")));
            carrito.setEstado(Estado_Carrito.CARRITO);
            carrito.setFechaCreacion(LocalDate.now());
            return carritoRepository.save(carrito);
        }
    }

    public CarritoDTO verCarrito(int idUsuario){
        Carrito carrito = obtenerOCrearCarrito(idUsuario);
        return toDTO(carrito);
    }

    public CarritoDTO agregarPoducto(int idUsuario, int idProducto, int cantidad){
        Carrito carrito = obtenerOCrearCarrito(idUsuario);
        Producto producto = productoRepository.findByActivo(true).stream()
                .filter(p -> p.getId() == idProducto)
                .findFirst()
                .orElseThrow(() -> new NoEncontradoException("Producto no encontrado"));

        if (producto.getStock() < cantidad) {
            throw new NoEncontradoException("Stock insuficiente");
        }

        CarritoProducto productos = carritoProductoService.obtenerOCrearItem(carrito, producto);
        productos.setCantidad(productos.getCantidad() + cantidad);
        carrito.setFechaActualizacion(LocalDate.now());
        return toDTO(carritoRepository.save(carrito));
    }

    public CarritoDTO eliminarProducto(int idUsuario, int idProducto){
        Carrito carrito = obtenerOCrearCarrito(idUsuario);
        carrito.getItems().removeIf(i -> i.getProducto().getId() == idProducto);
        carrito.setFechaActualizacion(LocalDate.now());
        return toDTO(carritoRepository.save(carrito));
    }

    public CarritoDTO realizarCompra(int idUsuario){
        Carrito carrito = obtenerOCrearCarrito(idUsuario);
        if(carrito.getItems().isEmpty()){
            throw new NoEncontradoException("El carrito está vacío");
        }
        for(CarritoProducto productos : carrito.getItems()){
            Producto producto = productos.getProducto();
            try{
                productoService.restaStock(producto.getId(), productos.getCantidad());
            } catch (NoEncontradoException e) {
                throw new NoEncontradoException(e.getMessage());
            }
        }
        carrito.setEstado(Estado_Carrito.ENVIO);
        carrito.setFechaActualizacion(LocalDate.now());
        carritoRepository.save(carrito);
        obtenerOCrearCarrito(idUsuario);
        return toDTO(carrito);
    }

    public List<CarritoDTO> listarHistorialCompras(int idUsuario){
        return carritoRepository.findByUsuarioIdUsuarioAndEstadoNot(idUsuario, Estado_Carrito.CARRITO)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public CarritoDTO confirmarEntrega(int idCarrito){
        Carrito carrito = isCarritoEstadoEnvio(idCarrito);
        carrito.setEstado(Estado_Carrito.COMPLETADO);
        carrito.setFechaActualizacion(LocalDate.now());
        return toDTO(carritoRepository.save(carrito));
    }

    public CarritoDTO cancelarCompra(int idCarrito){
        Carrito carrito = isCarritoEstadoEnvio(idCarrito);
        for(CarritoProducto productos : carrito.getItems()){
            Producto producto = productos.getProducto();
            try{
                productoService.sumaStock(producto.getId(), productos.getCantidad());
            } catch (NoEncontradoException e) {
                throw new NoEncontradoException(e.getMessage());
            }
        }
        carrito.setEstado(Estado_Carrito.CANCELADO);
        carrito.setFechaActualizacion(LocalDate.now());
        return toDTO(carritoRepository.save(carrito));
    }

    public Carrito isCarritoEstadoEnvio(int idCarrito){
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new NoEncontradoException("Carrito no encontrado"));
        if(carrito.getEstado() != Estado_Carrito.ENVIO) {
            throw new NoEncontradoException("El carrito no está en estado de envío");
        }
        return carrito;
    }

    private CarritoDTO toDTO(Carrito carrito) {
        List<CarritoProductoDTO> items = carrito.getItems().stream().map(a -> {
            CarritoProductoDTO dto = new CarritoProductoDTO();
            dto.setIdProducto(a.getProducto().getId());
            dto.setIdProducto(a.getProducto().getId());
            dto.setCantidad(a.getCantidad());
            dto.setPrecioUnitario(a.getPrecioUnitario());
            dto.setSubtotal(a.getCantidad() * a.getPrecioUnitario());
            return dto;
        }).toList();

        double total = items.stream().mapToDouble(CarritoProductoDTO::getSubtotal).sum();

        CarritoDTO dto = new CarritoDTO();
        dto.setId(carrito.getId());
        dto.setIdUsuario(carrito.getUsuario().getIdUsuario());
        dto.setEstado(carrito.getEstado());
        dto.setFechaCreacion(carrito.getFechaCreacion());
        dto.setFechaActualizacion(carrito.getFechaActualizacion());
        dto.setItems(items);
        dto.setTotal(total);
        return dto;
    }
}

