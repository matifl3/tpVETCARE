import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { SessionUser } from './models';

/** Respuesta de /api/auth/registro y /api/auth/login (campos extra del login). */
export interface LoginResponse extends SessionUser {
  mensaje?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  /** Usuario de la sesión; `null` = sin sesión verificada. */
  readonly user = signal<SessionUser | null>(null);

  /** GET /api/auth/me — guarda el usuario en la signal. */
  check(): Observable<SessionUser> {
    return this.api.get<SessionUser>('/api/auth/me').pipe(tap((user) => this.user.set(user)));
  }

  /** POST /api/auth/login */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.api
      .post<LoginResponse>('/api/auth/login', { email, password })
      .pipe(tap((user) => this.user.set(user)));
  }

  /** POST /api/auth/registro */
  registro(data: Record<string, unknown>): Observable<{ mensaje: string }> {
    return this.api.post<{ mensaje: string }>('/api/auth/registro', data);
  }

  /** POST /logout (Spring Security) */
  logout(): Observable<void> {
    return this.api.post<void>('/logout').pipe(tap(() => this.user.set(null)));
  }
}
