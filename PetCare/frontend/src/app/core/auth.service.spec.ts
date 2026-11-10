import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { providersDePrueba, USUARIO_CLIENTE } from '../testing/test-utils';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: providersDePrueba() });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('login guarda el token y el usuario', () => {
    service.login('ana@test.com', '123456').subscribe();

    const req = http.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'ana@test.com', password: '123456' });
    req.flush({ ...USUARIO_CLIENTE, token: 'token-123' });

    expect(service.getToken()).toBe('token-123');
    expect(service.user()?.email).toBe('ana@test.com');
  });

  it('logout borra el token y el usuario', () => {
    localStorage.setItem('petcare_token', 'token-123');
    service.user.set(USUARIO_CLIENTE);

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.user()).toBeNull();
  });

  it('check carga el usuario desde /api/auth/me', () => {
    service.check().subscribe();

    http.expectOne('/api/auth/me').flush(USUARIO_CLIENTE);

    expect(service.user()).toEqual(USUARIO_CLIENTE);
  });

  it('registro no guarda token (después hay que loguearse)', () => {
    service.registro({ email: 'nuevo@test.com' }).subscribe();

    http.expectOne('/api/auth/registro').flush({ mensaje: 'ok' });

    expect(service.getToken()).toBeNull();
  });
});
