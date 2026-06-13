package com.example.PetCare.service;

import com.example.PetCare.dto.CarritoDTO;
import com.example.PetCare.dto.CarritoProductoDTO;
import com.example.PetCare.enums.Estado_Carrito;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Carrito;
import com.example.PetCare.model.CarritoProducto;
import com.example.PetCare.model.Producto;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.CarritoRepository;
import com.example.PetCare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CarritoService {
    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoService productoService;
    private final CarritoProductoService carritoProductoService;

    /**
     * Busca el carrito activo (estado CARRITO) del usuario. Si no existe, lo crea y lo asocia al usuario.
     */
    public Carrito obtenerOCrearCarrito(int idUsuario) {
        return carritoRepository.findByUsuario_IdUsuarioAndEstado(idUsuario, Estado_Carrito.CARRITO)
                .orElseGet(() -> {
                    Usuario usuario = usuarioRepository.findById(idUsuario)
                            .orElseThrow(() -> new NoEncontradoException("Usuario no encontrado"));
                    Carrito carrito = new Carrito();
                    carrito.setUsuario(usuario);
                    carrito.setEstado(Estado_Carrito.CARRITO);
                    carrito.setFechaCreacion(LocalDate.now());
                    return carritoRepository.save(carrito);
                });
    }

    /**
     * Retorna el carrito activo actual del usuario convertido a DTO para mostrarlo en la vista/frontend.
     */
    public CarritoDTO verCarrito(int idUsuario){
        Carrito carrito = obtenerOCrearCarrito(idUsuario);
        return toDTO(carrito);
    }

    /**
     * Agrega un producto al carrito activo. Valida que exista stock suficiente sumando lo ya existente,
     * actualiza la cantidad y guarda los cambios.
     */
    public CarritoDTO agregarProducto(int idUsuario, int idProducto, int cantidad){
        Carrito carrito = obtenerOCrearCarrito(idUsuario);

        Producto producto = productoService.listarPorid(idProducto);
        CarritoProducto productos = carritoProductoService.obtenerOCrearItem(carrito, producto);
        int cantidadTotal = productos.getCantidad() + cantidad;

        productoService.validarProducto(producto, cantidadTotal);
        productos.setCantidad(cantidadTotal);
        carrito.setFechaActualizacion(LocalDate.now());
        return toDTO(carritoRepository.save(carrito));
    }

    /**
     * Elimina por completo un producto del carrito activo basándose en su ID y actualiza la fecha.
     */
    public CarritoDTO eliminarProducto(int idUsuario, int idProducto){
        Carrito carrito = obtenerOCrearCarrito(idUsuario);
        carrito.getItems().removeIf(i -> i.getProducto().getId() == idProducto);
        carrito.setFechaActualizacion(LocalDate.now());
        return toDTO(carritoRepository.save(carrito));
    }

    /**
     * Modifica la cantidad de un producto en el carrito activo. Si la cantidad es menor o igual a 0,
     * elimina el producto. Valida el stock antes de aplicar el nuevo valor.
     */
    public CarritoDTO modificarCantidad(int idUsuario, int idProducto, int cantidad){
        if(cantidad <= 0){
            return eliminarProducto(idUsuario, idProducto);
        }
        Carrito carrito = carritoRepository.findByUsuario_IdUsuarioAndEstado(idUsuario, Estado_Carrito.CARRITO)
                .orElseThrow(() -> new NoEncontradoException("Carrito no encontrado"));
        Producto producto = productoService.listarPorid(idProducto);
        productoService.validarProducto(producto, cantidad);
        carritoProductoService.modificarCantidad(carrito, producto, cantidad);
        carrito.setFechaActualizacion(LocalDate.now());
        return toDTO(carritoRepository.save(carrito));
    }

    /**
     * Cierra la compra: valida que el carrito no esté vacío, resta las cantidades del stock físico de los productos,
     * pasa el carrito a estado 'ENVIO' y genera un nuevo carrito vacío para futuras compras del usuario.
     */
    public CarritoDTO realizarCompra(int idUsuario){
        Carrito carrito = obtenerOCrearCarrito(idUsuario);
        if(carrito.getItems().isEmpty()){
            throw new NoEncontradoException("El carrito está vacío");
        }
        for(CarritoProducto productos : carrito.getItems()){
            productoService.restaStock(productos.getProducto().getId(), productos.getCantidad());
        }

        carrito.setEstado(Estado_Carrito.ENVIO);
        carrito.setFechaActualizacion(LocalDate.now());
        carritoRepository.save(carrito);
        obtenerOCrearCarrito(idUsuario);
        return toDTO(carrito);
    }

    /**
     * Recupera todos los carritos históricos del usuario cuyo estado NO sea 'CARRITO' (es decir, compras procesadas).
     */
    public List<CarritoDTO> listarHistorialCompras(int idUsuario){
        return carritoRepository.findByUsuarioIdUsuarioAndEstadoNot(idUsuario, Estado_Carrito.CARRITO)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    /**
     * Cambia el estado de un carrito en tránsito de 'ENVIO' a 'COMPLETADO', finalizando el ciclo de entrega.
     */
    public CarritoDTO confirmarEntrega(int idCarrito){
        Carrito carrito = obtenerCarritoEnEnvio(idCarrito);
        carrito.setEstado(Estado_Carrito.COMPLETADO);
        carrito.setFechaActualizacion(LocalDate.now());
        return toDTO(carritoRepository.save(carrito));
    }

    /**
     * Cancela una compra en estado de envío: devuelve las cantidades de los productos al stock físico,
     * cambia el estado del carrito a 'CANCELADO' y retorna un nuevo carrito activo actual del usuario.
     */
    public CarritoDTO cancelarCompra(int idUsuario, int idCarrito){
        Carrito carrito = obtenerCarritoEnEnvio(idCarrito);
        for(CarritoProducto productos : carrito.getItems()) {
            productoService.sumaStock(productos.getProducto().getId(), productos.getCantidad());
        }
        carrito.setEstado(Estado_Carrito.CANCELADO);
        carrito.setFechaActualizacion(LocalDate.now());
        carritoRepository.save(carrito);

        Carrito nuevoCarrito = obtenerOCrearCarrito(idUsuario);
        return toDTO(nuevoCarrito);
    }

    /**
     * Metodo auxiliar para buscar un carrito por ID y asegurarse de que se encuentre en estado 'ENVIO'.
     */
    public Carrito obtenerCarritoEnEnvio(int idCarrito){
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new NoEncontradoException("Carrito no encontrado"));
        if(carrito.getEstado() != Estado_Carrito.ENVIO) {
            throw new NoEncontradoException("El carrito no está en estado de envío");
        }
        return carrito;
    }

    /**
     * Metodo encargado de transformar la entidad 'Carrito' y sus relaciones a un DTO específico para la vista,
     * calculando subtotales por producto y el precio total general de la compra.
     */
    private CarritoDTO toDTO(Carrito carrito) {
        List<CarritoProductoDTO> items = carrito.getItems().stream().map(a -> {
            CarritoProductoDTO dto = new CarritoProductoDTO();
            dto.setId(a.getId());
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
        dto.setMetodoPago(carrito.getMetodoPago());
        return dto;
    }
}

