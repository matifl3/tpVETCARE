package com.example.PetCare.repository;

import com.example.PetCare.enums.Estado_Carrito;
import com.example.PetCare.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Integer> {

    // Busca el carrito activo (estado CARRITO) de un usuario específico
    Optional<Carrito> findByUsuario_IdUsuarioAndEstado(Integer idUsuario, Estado_Carrito estadoCarrito);

    // Busca todos los carritos de un usuario que NO estén en estado CARRITO (historial de compras)
    List<Carrito> findByUsuarioIdUsuarioAndEstadoNot(Integer idUsuario, Estado_Carrito estado);

    // Busca carritos completados o en envío dentro de un rango de fechas (para historial de ventas)
    @Query("SELECT c FROM Carrito c WHERE c.estado IN ('ENVIO', 'COMPLETADO') " +
           "AND c.fechaActualizacion BETWEEN :fechaInicio AND :fechaFin " +
           "ORDER BY c.fechaActualizacion DESC")
    List<Carrito> findVentasPorRangoFechas(
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin);

    // Calcula la ganancia total de un mes específico: suma los totales de carritos completados
    // Retorna una lista con un Object[] donde [0] = cantidad de ventas, [1] = ganancia total
    @Query("SELECT COUNT(c), COALESCE(SUM(c.total), 0) FROM Carrito c " +
           "WHERE c.estado = 'COMPLETADO' " +
           "AND YEAR(c.fechaActualizacion) = :anio " +
           "AND MONTH(c.fechaActualizacion) = :mes")
    List<Object[]> calcularGananciaMensual(@Param("anio") int anio, @Param("mes") int mes);

    // Busca los productos más vendidos en un mes específico.
    // Hace JOIN entre Carrito y CarritoProducto, agrupa por producto y ordena por cantidad vendida descendente.
    // Retorna Object[] donde [0] = idProducto, [1] = nombre, [2] = categoria, [3] = cantidadVendida, [4] = gananciaTotal
    @Query("SELECT cp.producto.id, cp.producto.nombre, cp.producto.categoria, " +
           "SUM(cp.cantidad) as cantidadVendida, " +
           "SUM(cp.cantidad * cp.precioUnitario) as gananciaTotal " +
           "FROM CarritoProducto cp " +
           "JOIN cp.carrito c " +
           "WHERE c.estado = 'COMPLETADO' " +
           "AND YEAR(c.fechaActualizacion) = :anio " +
           "AND MONTH(c.fechaActualizacion) = :mes " +
           "GROUP BY cp.producto.id, cp.producto.nombre, cp.producto.categoria " +
           "ORDER BY cantidadVendida DESC")
    List<Object[]> findProductosMasVendidosPorMes(
            @Param("anio") int anio,
            @Param("mes") int mes);
}
