import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Carrito } from '../core/models';

/** Equivale al objeto `api.carrito` de frontend/src/services/api.js */
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly api = inject(ApiService);

  obtener(): Observable<Carrito> {
    return this.api.get<Carrito>('/api/carrito');
  }

  agregar(idProducto: number | string, cantidad: number | string): Observable<Carrito> {
    return this.api.postWithParams<Carrito>('/api/carrito/agregar', { idProducto, cantidad });
  }

  eliminar(idProducto: number | string): Observable<Carrito> {
    return this.api.deleteWithParams<Carrito>('/api/carrito/eliminar', { idProducto });
  }

  modificar(idProducto: number | string, cantidad: number | string): Observable<Carrito> {
    return this.api.putWithParams<Carrito>('/api/carrito/modificar', { idProducto, cantidad });
  }

  agregarTurno(data: Record<string, unknown>): Observable<Carrito> {
    return this.api.post<Carrito>('/api/carrito/agregar-turno', data);
  }

  eliminarTurno(idCarritoTurno: number | string): Observable<Carrito> {
    return this.api.delete<Carrito>(`/api/carrito/eliminar-turno/${idCarritoTurno}`);
  }

  comprar(data: Record<string, unknown>): Observable<any> {
    return this.api.post<any>('/api/carrito/comprar', data);
  }

  historial(): Observable<Carrito[]> {
    return this.api.get<Carrito[]>('/api/carrito/historial');
  }
}
