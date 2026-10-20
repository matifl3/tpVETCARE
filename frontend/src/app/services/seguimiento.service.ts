import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Seguimiento } from '../core/models';

@Injectable({ providedIn: 'root' })
export class SeguimientoService {
  private readonly api = inject(ApiService);

  obtener(idMascota: number | string): Observable<Seguimiento> {
    return this.api.get<Seguimiento>(`/api/mascotas/${idMascota}/seguimiento`);
  }

  registrarProgreso(idMascota: number | string, data: Record<string, unknown>): Observable<Seguimiento> {
    return this.api.post<Seguimiento>(`/api/mascotas/${idMascota}/seguimiento`, data);
  }
}
