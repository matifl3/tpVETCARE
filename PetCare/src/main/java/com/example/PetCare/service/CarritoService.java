package com.example.PetCare.service;

import com.example.PetCare.dto.*;
import com.example.PetCare.enums.Estado_Carrito;
import com.example.PetCare.enums.Metodo_Pago;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.*;
import com.example.PetCare.repository.CarritoRepository;
import com.example.PetCare.repository.TarjetaRepository;
import com.example.PetCare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoService productoService;
    private final CarritoProductoService carritoProductoService;
    private final TarjetaService tarjetaService;

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
     * Valida el carrito y el metodo de pago antes de ejecutar la compra.
     * Si el metodo de pago es TARJETA, verifica que la tarjeta exista,
     * pertenezca al usuario y esté activa.
     * No modifica ningún dato en la base de datos.
     */
    public CarritoDTO confirmarCompra(CompraRequestDTO dto){
        Carrito carrito = obtenerOCrearCarrito(dto.getId_usuario());

        if(carrito.getItems().isEmpty()){
            throw new NoEncontradoException("El carrito está vacío");
        }

        if(dto.getMetodoPago() == Metodo_Pago.TARJETA){
            tarjetaService.resolverPagoConTarjeta(dto);
        }

        return toDTO(carrito);
    }

    /**
     * Cierra la compra: valida que el carrito no esté vacío, resta las cantidades del stock físico de los productos,
     * pasa el carrito a estado 'ENVIO' y genera un nuevo carrito vacío para futuras compras del usuario.
     */
    public CarritoDTO realizarCompra(CompraRequestDTO dto){
        confirmarCompra(dto);
        Carrito carrito = obtenerOCrearCarrito(dto.getId_usuario());


        for(CarritoProducto productos : carrito.getItems()){
            productoService.restaStock(productos.getProducto().getId(), productos.getCantidad());
        }

        carrito.setEstado(Estado_Carrito.ENVIO);
        carrito.setMetodoPago(dto.getMetodoPago());
        carrito.setFechaActualizacion(LocalDate.now());
        carritoRepository.save(carrito);
        obtenerOCrearCarrito(dto.getId_usuario());
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

    // ==================== FUNCIONALIDADES DE REPORTES ====================

    /**
     * Obtiene el historial completo de ventas en un rango de fechas.
     * Retorna todos los carritos que estén en estado ENVIO o COMPLETADO dentro del rango.
     * Útil para ver qué se vendió en un período determinado.
     *
     * @param fechaInicio Fecha de inicio del rango (inclusiva)
     * @param fechaFin Fecha de fin del rango (inclusiva)
     * @return Lista de carritos convertidos a DTO con sus items y totales
     */
    public List<CarritoDTO> obtenerHistorialVentas(LocalDate fechaInicio, LocalDate fechaFin) {
        // Usa el query del repository que filtra por estado y rango de fechas
        return carritoRepository.findVentasPorRangoFechas(fechaInicio, fechaFin)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    /**
     * Calcula las ganancias de un mes específico.
     * Retorna un DTO con el año, mes, cantidad de ventas y ganancia total.
     *
     * @param anio Año a consultar (ej: 2026)
     * @param mes Mes a consultar (1-12, donde 1 = enero)
     * @return DTO con las ganancias del mes
     */
    public GananciaMensualDTO obtenerGananciaMensual(int anio, int mes) {
        // Valida que el mes sea válido
        if (mes < 1 || mes > 12) {
            throw new NoEncontradoException("El mes debe estar entre 1 y 12");
        }

        // Ejecuta el query que suma los totales de carritos completados en el mes
        Object[] resultado = carritoRepository.calcularGananciaMensual(anio, mes);

        // resultado[0] = cantidad de ventas (Long)
        // resultado[1] = ganancia total (Double)
        long cantidadVentas = (Long) resultado[0];
        double gananciaTotal = (Double) resultado[1];

        return new GananciaMensualDTO(anio, mes, cantidadVentas, gananciaTotal);
    }

    /**
     * Obtiene los productos más vendidos en un mes específico.
     * Retorna una lista ordenada de mayor a menor cantidad vendida.
     *
     * @param anio Año a consultar
     * @param mes Mes a consultar (1-12)
     * @return Lista de productos ordenados por cantidad vendida descendente
     */
    public List<ProductoMasVendidoDTO> obtenerProductosMasVendidos(int anio, int mes) {
        // Valida que el mes sea válido
        if (mes < 1 || mes > 12) {
            throw new NoEncontradoException("El mes debe estar entre 1 y 12");
        }

        // Ejecuta el query que agrupa por producto y suma cantidades
        List<Object[]> resultados = carritoRepository.findProductosMasVendidosPorMes(anio, mes);

        // Convierte cada resultado a un DTO
        List<ProductoMasVendidoDTO> productos = new ArrayList<>();
        for (Object[] fila : resultados) {
            ProductoMasVendidoDTO dto = new ProductoMasVendidoDTO();
            dto.setIdProducto((Integer) fila[0]);       // ID del producto
            dto.setNombreProducto((String) fila[1]);    // Nombre del producto
            dto.setCategoria((String) fila[2]);          // Categoría del producto
            dto.setCantidadVendida(((Long) fila[3]).intValue()); // Cantidad total vendida
            dto.setGananciaTotal((Double) fila[4]);      // Ganancia total del producto
            productos.add(dto);
        }

        return productos;
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
            dto.setProductoNombre(a.getProducto().getNombre());
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

