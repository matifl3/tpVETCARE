import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { SessionUser } from './models';

/** Respuesta de /api/auth/login: datos del usuario + token JWT. */
export interface LoginResponse extends SessionUser {
  token: string;
  mensaje?: string;
}

const TOKEN_KEY = 'petcare_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  /** Usuario logueado; `null` = sin sesión verificada. */
  readonly user = signal<SessionUser | null>(null);

  /** Token JWT guardado (lo usa el interceptor para armar el header Authorization). */
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /** GET /api/auth/me — valida el token y guarda el usuario en la signal. */
  check(): Observable<SessionUser> {
    return this.api.get<SessionUser>('/api/auth/me').pipe(tap((user) => this.user.set(user)));
  }

  /** POST /api/auth/login — guarda el token y el usuario. */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
      tap((res) => {
        this.saveToken(res.token);
        this.user.set(res);
      })
    );
  }

  /** POST /api/auth/registro */
  registro(data: Record<string, unknown>): Observable<{ mensaje: string }> {
    return this.api.post<{ mensaje: string }>('/api/auth/registro', data);
  }

  /** Con JWT el logout es local: se borra el token y listo. */
  logout(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage no disponible */
    }
    this.user.set(null);
  }

  private saveToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage no disponible */
    }
  }
}
