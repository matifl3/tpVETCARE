import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type QueryParams = Record<string, string | number | boolean>;

/**
 * Cliente HTTP base. Siempre envía las cookies de sesión (`withCredentials`).
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.url(endpoint), { withCredentials: true });
  }

  post<T>(endpoint: string, body?: unknown): Observable<T> {
    return this.http.post<T>(this.url(endpoint), body ?? null, { withCredentials: true });
  }

  put<T>(endpoint: string, body?: unknown): Observable<T> {
    return this.http.put<T>(this.url(endpoint), body ?? null, { withCredentials: true });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.url(endpoint), { withCredentials: true });
  }

  postWithParams<T>(endpoint: string, params: QueryParams): Observable<T> {
    return this.http.post<T>(this.url(endpoint), null, {
      params: this.toParams(params),
      withCredentials: true,
    });
  }

  putWithParams<T>(endpoint: string, params: QueryParams): Observable<T> {
    return this.http.put<T>(this.url(endpoint), null, {
      params: this.toParams(params),
      withCredentials: true,
    });
  }

  deleteWithParams<T>(endpoint: string, params: QueryParams): Observable<T> {
    return this.http.delete<T>(this.url(endpoint), {
      params: this.toParams(params),
      withCredentials: true,
    });
  }

  private url(endpoint: string): string {
    return `${this.base}${endpoint}`;
  }

  private toParams(params: QueryParams): HttpParams {
    let hp = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      hp = hp.set(key, String(value));
    }
    return hp;
  }
}
