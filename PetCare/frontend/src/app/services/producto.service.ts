import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Producto } from '../core/models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly api = inject(ApiService);

  listar(): Observable<Producto[]> {
    return this.api.get<Producto[]>('/api/productos');
  }

  porCategoria(categoria: string): Observable<Producto[]> {
    return this.api.get<Producto[]>(`/api/productos/categoria/${encodeURIComponent(categoria)}`);
  }

  buscarPorId(id: number | string): Observable<Producto> {
    return this.api.get<Producto>(`/api/productos/${id}`);
  }

  buscarPorNombre(nombre: string): Observable<Producto[]> {
    return this.api.get<Producto[]>(`/api/productos/nombre/${encodeURIComponent(nombre)}`);
  }

  crear(data: Partial<Producto>): Observable<Producto> {
    return this.api.post<Producto>('/api/productos', data);
  }

  actualizar(id: number | string, data: Partial<Producto>): Observable<Producto> {
    return this.api.put<Producto>(`/api/productos/${id}`, data);
  }

  eliminar(id: number | string): Observable<void> {
    return this.api.delete<void>(`/api/productos/${id}`);
  }
}
