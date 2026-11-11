import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { GananciaMensual, ProductoMasVendido, ReporteVenta } from '../core/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

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

  exportarVentasPdf(desde: string, hasta: string): Observable<Blob> {
    const params = new HttpParams().set('fechaInicio', desde).set('fechaFin', hasta);
    return this.http.get(`${this.baseUrl}/api/carrito/reportes/ventas/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  exportarVentasCsv(desde: string, hasta: string): Observable<Blob> {
    const params = new HttpParams().set('fechaInicio', desde).set('fechaFin', hasta);
    return this.http.get(`${this.baseUrl}/api/carrito/resportes/ventas/csv`, {
      params,
      responseType: 'blob'
    });
  }
}
