package com.example.PetCare.service;

import com.example.PetCare.dto.CarritoDTO;
import com.example.PetCare.enums.Estado_Carrito;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Carrito;
import com.example.PetCare.model.CarritoProducto;
import com.example.PetCare.model.Producto;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.CarritoRepository;
import com.example.PetCare.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarritoServiceTest {

    @Mock
    private CarritoRepository carritoRepository;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private ProductoService productoService;
    @Mock
    private CarritoProductoService carritoProductoService;

    // CarritoService tiene más dependencias (tarjetas, turnos, etc.) que estos tests no usan:
    // @InjectMocks les pasa null y no pasa nada porque no se llaman.
    @InjectMocks
    private CarritoService carritoService;

    private Usuario cliente;
    private Carrito carrito;
    private Producto alimento;

    @BeforeEach
    void setUp() {
        cliente = new Usuario();
        cliente.setIdUsuario(1);

        carrito = new Carrito();
        carrito.setId(100);
        carrito.setUsuario(cliente);
        carrito.setEstado(Estado_Carrito.CARRITO);

        alimento = new Producto();
        alimento.setId(5);
        alimento.setNombre("Alimento balanceado");
        alimento.setPrecio(2000.0);
        alimento.setStock(10);
        alimento.setActivo(true);
    }

    private CarritoProducto itemEnCarrito(int cantidad) {
        CarritoProducto item = new CarritoProducto();
        item.setCarrito(carrito);
        item.setProducto(alimento);
        item.setCantidad(cantidad);
        item.setPrecioUnitario(alimento.getPrecio());
        carrito.getItems().add(item);
        return item;
    }

    @Test
    @DisplayName("Si el usuario no tiene carrito activo se le crea uno")
    void creaCarritoSiNoExiste() {
        when(carritoRepository.findByUsuario_IdUsuarioAndEstado(1, Estado_Carrito.CARRITO)).thenReturn(Optional.empty());
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(cliente));
        when(carritoRepository.save(any(Carrito.class))).thenAnswer(inv -> inv.getArgument(0));

        Carrito nuevo = carritoService.obtenerOCrearCarrito(1);

        assertEquals(Estado_Carrito.CARRITO, nuevo.getEstado());
        assertEquals(cliente, nuevo.getUsuario());
        assertNotNull(nuevo.getFechaCreacion());
    }

    @Test
    @DisplayName("Agregar un producto que ya está suma la cantidad y recalcula el total")
    void agregarProductoSumaCantidad() {
        CarritoProducto item = itemEnCarrito(2);
        when(carritoRepository.findByUsuario_IdUsuarioAndEstado(1, Estado_Carrito.CARRITO)).thenReturn(Optional.of(carrito));
        when(productoService.listarPorid(5)).thenReturn(alimento);
        when(carritoProductoService.obtenerOCrearItem(carrito, alimento)).thenReturn(item);
        when(carritoRepository.save(carrito)).thenReturn(carrito);

        CarritoDTO dto = carritoService.agregarProducto(1, 5, 3);

        assertEquals(5, item.getCantidad());
        assertEquals(10000.0, dto.getTotal()); // 5 x 2000
        verify(productoService).validarProducto(alimento, 5);
    }

    @Test
    @DisplayName("Si no hay stock no se agrega el producto")
    void agregarProductoSinStock() {
        CarritoProducto item = itemEnCarrito(0);
        when(carritoRepository.findByUsuario_IdUsuarioAndEstado(1, Estado_Carrito.CARRITO)).thenReturn(Optional.of(carrito));
        when(productoService.listarPorid(5)).thenReturn(alimento);
        when(carritoProductoService.obtenerOCrearItem(carrito, alimento)).thenReturn(item);
        doThrow(new NoEncontradoException("Stock insuficiente")).when(productoService).validarProducto(alimento, 50);

        assertThrows(NoEncontradoException.class, () -> carritoService.agregarProducto(1, 5, 50));
        assertEquals(0, item.getCantidad());
        verify(carritoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Modificar la cantidad a 0 saca el producto del carrito")
    void modificarCantidadACeroElimina() {
        itemEnCarrito(2);
        when(carritoRepository.findByUsuario_IdUsuarioAndEstado(1, Estado_Carrito.CARRITO)).thenReturn(Optional.of(carrito));
        when(carritoRepository.save(carrito)).thenReturn(carrito);

        CarritoDTO dto = carritoService.modificarCantidad(1, 5, 0);

        assertTrue(dto.getItems().isEmpty());
        assertEquals(0.0, dto.getTotal());
    }
}
