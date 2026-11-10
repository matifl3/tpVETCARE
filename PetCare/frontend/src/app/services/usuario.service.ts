import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Usuario } from '../core/models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly api = inject(ApiService);

  listar(): Observable<Usuario[]> {
    return this.api.get<Usuario[]>('/api/usuarios');
  }

  buscarPorId(id: number | string): Observable<Usuario> {
    return this.api.get<Usuario>(`/api/usuarios/buscar/${id}`);
  }

  actualizar(data: Partial<Usuario>): Observable<Usuario> {
    return this.api.put<Usuario>('/api/usuarios/actualizar', data);
  }

  eliminar(id: number | string): Observable<void> {
    return this.api.delete<void>(`/api/usuarios/eliminar/${id}`);
  }
}
