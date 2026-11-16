import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { MensajeResponse, Profesional } from '../core/models';

@Injectable({ providedIn: 'root' })
export class ProfesionalService {
  private readonly api = inject(ApiService);

  listar(): Observable<Profesional[]> {
    return this.api.get<Profesional[]>('/api/profesionales');
  }

  porRol(rol: string): Observable<Profesional[]> {
    return this.api.get<Profesional[]>(`/api/profesionales/rol/${rol}`);
  }

  buscarPorId(id: number | string): Observable<Profesional> {
    return this.api.get<Profesional>(`/api/profesionales/${id}`);
  }

  pendientes(): Observable<Profesional[]> {
    return this.api.get<Profesional[]>('/api/profesionales/pendientes');
  }

  aprobar(id: number | string): Observable<MensajeResponse> {
    return this.api.put<MensajeResponse>(`/api/profesionales/${id}/aprobar`);
  }

  rechazar(id: number | string): Observable<MensajeResponse> {
    return this.api.put<MensajeResponse>(`/api/profesionales/${id}/rechazar`);
  }
}
