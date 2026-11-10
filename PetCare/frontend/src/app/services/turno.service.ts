import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Turno } from '../core/models';

@Injectable({ providedIn: 'root' })
export class TurnoService {
  private readonly api = inject(ApiService);

  misTurnos(): Observable<Turno[]> {
    return this.api.get<Turno[]>('/api/turnos/mis-turnos');
  }

  listarTodos(): Observable<Turno[]> {
    return this.api.get<Turno[]>('/api/turnos');
  }

  porProfesional(idProfesional: number | string): Observable<Turno[]> {
    return this.api.get<Turno[]>(`/api/turnos/profesional/${idProfesional}`);
  }

  solicitar(data: Record<string, unknown>): Observable<Turno> {
    return this.api.post<Turno>('/api/turnos/solicitar', data);
  }

  cancelar(id: number | string): Observable<Turno> {
    return this.api.put<Turno>(`/api/turnos/${id}/cancelar`);
  }

  disponibilidad(idProfesional: number | string, fecha: string): Observable<any> {
    return this.api.get<any>(`/api/turnos/disponibilidad/${idProfesional}?fecha=${fecha}`);
  }
}
