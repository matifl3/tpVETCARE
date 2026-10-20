import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { GananciaMensual, ProductoMasVendido, ReporteVenta } from '../core/models';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly api = inject(ApiService);

  ventas(fechaInicio: string, fechaFin: string): Observable<ReporteVenta[]> {
    return this.api.get<ReporteVenta[]>(
      `/api/carrito/reportes/ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }

  ganancias(anio: number, mes: number): Observable<GananciaMensual> {
    return this.api.get<GananciaMensual>(`/api/carrito/reportes/ganancias?anio=${anio}&mes=${mes}`);
  }

  productosMasVendidos(anio: number, mes: number): Observable<ProductoMasVendido[]> {
    return this.api.get<ProductoMasVendido[]>(
      `/api/carrito/reportes/productos-mas-vendidos?anio=${anio}&mes=${mes}`
    );
  }
}
