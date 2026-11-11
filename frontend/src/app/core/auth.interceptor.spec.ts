import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { providersDePrueba, USUARIO_CLIENTE } from '../testing/test-utils';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let http: HttpTestingController;
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: providersDePrueba() });
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('agrega el header Authorization cuando hay token', () => {
    localStorage.setItem('petcare_token', 'token-123');

    httpClient.get('/api/mascotas').subscribe();

    const req = http.expectOne('/api/mascotas');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');
    req.flush([]);
  });

  it('no agrega el header si no hay token', () => {
    httpClient.get('/api/mascotas').subscribe();

    const req = http.expectOne('/api/mascotas');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush([]);
  });

  it('ante un 401 cierra la sesión y vuelve al login', () => {
    localStorage.setItem('petcare_token', 'token-vencido');
    auth.user.set(USUARIO_CLIENTE);

    httpClient.get('/api/mascotas').subscribe({ error: () => {} });
    http
      .expectOne('/api/mascotas')
      .flush({ error: 'No autenticado' }, { status: 401, statusText: 'Unauthorized' });

    expect(auth.getToken()).toBeNull();
    expect(auth.user()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('un 401 en el login no redirige (son credenciales inválidas)', () => {
    httpClient.post('/api/auth/login', {}).subscribe({ error: () => {} });
    http
      .expectOne('/api/auth/login')
      .flush({ error: 'Credenciales inválidas' }, { status: 401, statusText: 'Unauthorized' });

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
