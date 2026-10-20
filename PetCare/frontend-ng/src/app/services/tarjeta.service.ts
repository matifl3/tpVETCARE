import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Tarjeta } from '../core/models';

/** Equivale al objeto `api.tarjetas` de frontend/src/services/api.js */
@Injectable({ providedIn: 'root' })
export class TarjetaService {
  private readonly api = inject(ApiService);

  listar(): Observable<Tarjeta[]> {
    return this.api.get<Tarjeta[]>('/api/tarjetas');
  }

  agregar(data: Record<string, unknown>): Observable<Tarjeta> {
    return this.api.post<Tarjeta>('/api/tarjetas/agregar', data);
  }

  eliminar(id: number | string): Observable<void> {
    return this.api.delete<void>(`/api/tarjetas/eliminar/${id}`);
  }
}
