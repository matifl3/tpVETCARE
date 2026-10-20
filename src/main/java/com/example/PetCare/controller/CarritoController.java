package com.example.PetCare.controller;

import com.example.PetCare.dto.CarritoDTO;
import com.example.PetCare.dto.CompraRequestDTO;
import com.example.PetCare.dto.GananciaMensualDTO;
import com.example.PetCare.dto.ProductoMasVendidoDTO;
import com.example.PetCare.service.CarritoService;
import com.example.PetCare.utils.AuthUtils;
import com.example.PetCare.model.Usuario;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;
    private final AuthUtils authUtils;

    public CarritoController(CarritoService carritoService, AuthUtils authUtils) {
        this.carritoService = carritoService;
        this.authUtils = authUtils;
    }

    // ==================== OPERACIONES DEL CARRITO (CLIENTE) ====================

    /**
     * Obtiene el carrito activo del usuario autenticado.
     * Si no tiene carrito, lo crea automáticamente.
     */
    @GetMapping
    public CarritoDTO verCarrito() {
        Usuario usuario = authUtils.getCurrentUsuario();
        return carritoService.verCarrito(usuario.getIdUsuario());
    }

    /**
     * Agrega un producto al carrito del usuario autenticado.
     * Valida que haya stock suficiente.
     */
    @PostMapping("/agregar")
    public CarritoDTO agregarProducto(@RequestParam int idProducto, @RequestParam int cantidad) {
        Usuario usuario = authUtils.getCurrentUsuario();
        return carritoService.agregarProducto(usuario.getIdUsuario(), idProducto, cantidad);
    }

    /**
     * Elimina un producto completamente del carrito del usuario autenticado.
     */
    @DeleteMapping("/eliminar")
    public CarritoDTO eliminarProducto(@RequestParam int idProducto) {
        Usuario usuario = authUtils.getCurrentUsuario();
        return carritoService.eliminarProducto(usuario.getIdUsuario(), idProducto);
    }

    /**
     * Modifica la cantidad de un producto en el carrito.
     * Si la cantidad es 0 o menor, elimina el producto.
     */
    @PutMapping("/modificar")
    public CarritoDTO modificarCantidad(@RequestParam int idProducto, @RequestParam int cantidad) {
        Usuario usuario = authUtils.getCurrentUsuario();
        return carritoService.modificarCantidad(usuario.getIdUsuario(), idProducto, cantidad);
    }

    /**
     * Agrega un turno (reserva de servicio) al carrito del usuario autenticado.
     */
    @PostMapping("/agregar-turno")
    public CarritoDTO agregarTurno(@RequestBody Map<String, Object> body) {
        Usuario usuario = authUtils.getCurrentUsuario();
        Integer idProfesional = Integer.parseInt(body.get("idProfesional").toString());
        Integer idMascota = Integer.parseInt(body.get("idMascota").toString());
        String fechaStr = (String) body.get("fecha");
        LocalDate fecha = LocalDate.parse(fechaStr);
        Integer horas = body.containsKey("horas") ? Integer.parseInt(body.get("horas").toString()) : 1;
        Double precio = body.containsKey("precio") ? Double.parseDouble(body.get("precio").toString()) : 0.0;
        return carritoService.agregarTurno(usuario.getIdUsuario(), idProfesional, idMascota, fecha, horas, precio);
    }

    /**
     * Elimina un turno del carrito del usuario autenticado.
     */
    @DeleteMapping("/eliminar-turno/{idCarritoTurno}")
    public CarritoDTO eliminarTurno(@PathVariable int idCarritoTurno) {
        Usuario usuario = authUtils.getCurrentUsuario();
        return carritoService.eliminarTurno(usuario.getIdUsuario(), idCarritoTurno);
    }

    /**
     * Confirma la compra: descuenta stock, cambia estado a ENVIO y crea un carrito nuevo vacío.
     */
    @PostMapping("/comprar")
    public CarritoDTO realizarCompra(@RequestBody CompraRequestDTO dto) {
        Usuario usuario = authUtils.getCurrentUsuario();
        dto.setId_usuario(usuario.getIdUsuario());
        return carritoService.realizarCompra(dto);
    }

    /**
     * Muestra el historial de compras del usuario autenticado (carritos que no están en estado CARRITO).
     */
    @GetMapping("/historial")
    public List<CarritoDTO> listarHistorialCompras() {
        Usuario usuario = authUtils.getCurrentUsuario();
        return carritoService.listarHistorialCompras(usuario.getIdUsuario());
    }

    // ==================== OPERACIONES DE GESTIÓN (ADMIN/PROFESIONAL) ====================

    /**
     * Confirma la entrega de un carrito: cambia estado de ENVIO a COMPLETADO.
     * Solo ADMIN y PROFESIONALES pueden confirmar entregas.
     */
    @PutMapping("/{idCarrito}/confirmar-entrega")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VETERINARIO') or hasRole('PASEADOR') or hasRole('PELUQUERO') or hasRole('ADIESTRADOR') or hasRole('CUIDADOR')")
    public CarritoDTO confirmarEntrega(@PathVariable int idCarrito) {
        return carritoService.confirmarEntrega(idCarrito);
    }

    /**
     * Cancela una compra en estado ENVIO: devuelve stock y cambia estado a CANCELADO.
     * Solo ADMIN puede cancelar compras de otros usuarios.
     */
    @PutMapping("/{idUsuario}/cancelar/{idCarrito}")
    @PreAuthorize("hasRole('ADMIN')")
    public CarritoDTO cancelarCompra(@PathVariable int idUsuario, @PathVariable int idCarrito) {
        return carritoService.cancelarCompra(idUsuario, idCarrito);
    }

    // ==================== REPORTES (SOLO ADMIN) ====================

    /**
     * Obtiene el historial de ventas en un rango de fechas.
     * Retorna todos los carritos completados o en envío dentro del rango.
     * Solo ADMIN puede ver el historial completo de ventas.
     *
     * Ejemplo de uso: GET /api/carrito/reportes/ventas?fechaInicio=2026-01-01&fechaFin=2026-01-31
     */
    @GetMapping("/reportes/ventas")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CarritoDTO> obtenerHistorialVentas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return carritoService.obtenerHistorialVentas(fechaInicio, fechaFin);
    }

    /**
     * Obtiene las ganancias de un mes específico.
     * Retorna cantidad de ventas y ganancia total del mes.
     * Solo ADMIN puede ver reportes financieros.
     *
     * Ejemplo de uso: GET /api/carrito/reportes/ganancias?anio=2026&mes=1
     */
    @GetMapping("/reportes/ganancias")
    @PreAuthorize("hasRole('ADMIN')")
    public GananciaMensualDTO obtenerGananciaMensual(
            @RequestParam int anio,
            @RequestParam int mes) {
        return carritoService.obtenerGananciaMensual(anio, mes);
    }

    /**
     * Obtiene los productos más vendidos en un mes específico.
     * Retorna una lista ordenada de mayor a menor cantidad vendida.
     * Solo ADMIN puede ver este reporte.
     *
     * Ejemplo de uso: GET /api/carrito/reportes/productos-mas-vendidos?anio=2026&mes=1
     */
    @GetMapping("/reportes/productos-mas-vendidos")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ProductoMasVendidoDTO> obtenerProductosMasVendidos(
            @RequestParam int anio,
            @RequestParam int mes) {
        return carritoService.obtenerProductosMasVendidos(anio, mes);
    }
}
