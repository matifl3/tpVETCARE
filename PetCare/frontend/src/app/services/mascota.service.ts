import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Mascota } from '../core/models';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private readonly api = inject(ApiService);

  misMascotas(): Observable<Mascota[]> {
    return this.api.get<Mascota[]>('/api/mascotas/mias');
  }

  listarTodos(): Observable<Mascota[]> {
    return this.api.get<Mascota[]>('/api/mascotas');
  }

  atendidasPor(idProfesional: number | string): Observable<Mascota[]> {
    return this.api.get<Mascota[]>(`/api/mascotas/atendidas/${idProfesional}`);
  }

  crear(data: Partial<Mascota>): Observable<Mascota> {
    return this.api.post<Mascota>('/api/mascotas/mias', data);
  }

  actualizar(id: number | string, data: Partial<Mascota>): Observable<Mascota> {
    return this.api.put<Mascota>(`/api/mascotas/${id}`, data);
  }

  actualizarMia(id: number | string, data: Partial<Mascota>): Observable<Mascota> {
    return this.api.put<Mascota>(`/api/mascotas/mias/${id}`, data);
  }

  eliminar(id: number | string): Observable<void> {
    return this.api.delete<void>(`/api/mascotas/${id}`);
  }

  eliminarMia(id: number | string): Observable<void> {
    return this.api.delete<void>(`/api/mascotas/mias/${id}`);
  }

  buscarPorId(id: number | string): Observable<Mascota> {
    return this.api.get<Mascota>(`/api/mascotas/${id}`);
  }
}
