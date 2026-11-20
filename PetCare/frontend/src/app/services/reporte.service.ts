import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { GananciaMensual, ProductoMasVendido, ReporteVenta } from '../core/models';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly api = inject(ApiService);

  ventas(fechaInicio: string, fechaFin: string): Observable<ReporteVenta[]> {
    return this.api.getWithParams<ReporteVenta[]>('/api/carrito/reportes/ventas', {
      fechaInicio,
      fechaFin,
    });
  }

  ganancias(anio: number, mes: number): Observable<GananciaMensual> {
    return this.api.getWithParams<GananciaMensual>('/api/carrito/reportes/ganancias', {
      anio,
      mes,
    });
  }

  productosMasVendidos(anio: number, mes: number): Observable<ProductoMasVendido[]> {
    return this.api.getWithParams<ProductoMasVendido[]>(
      '/api/carrito/reportes/productos-mas-vendidos',
      { anio, mes },
    );
  }
}