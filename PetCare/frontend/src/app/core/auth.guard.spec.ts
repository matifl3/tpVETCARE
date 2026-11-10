import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { providersDePrueba, USUARIO_CLIENTE } from '../testing/test-utils';

describe('authGuard', () => {
  let auth: AuthService;
  let http: HttpTestingController;
  let router: Router;

  const ejecutarGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: providersDePrueba() });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('deja pasar si el usuario ya está cargado', () => {
    auth.user.set(USUARIO_CLIENTE);
    expect(ejecutarGuard()).toBeTrue();
  });

  it('sin token manda al login', () => {
    const resultado = ejecutarGuard() as UrlTree;
    expect(router.serializeUrl(resultado)).toBe('/login');
  });

  it('con token válido consulta /api/auth/me y deja pasar', async () => {
    localStorage.setItem('petcare_token', 'token-123');

    const resultado = firstValueFrom(ejecutarGuard() as Observable<boolean | UrlTree>);
    http.expectOne('/api/auth/me').flush(USUARIO_CLIENTE);

    expect(await resultado).toBeTrue();
    expect(auth.user()?.email).toBe(USUARIO_CLIENTE.email);
  });

  it('con token inválido borra el token y manda al login', async () => {
    localStorage.setItem('petcare_token', 'token-trucho');

    const resultado = firstValueFrom(ejecutarGuard() as Observable<boolean | UrlTree>);
    http
      .expectOne('/api/auth/me')
      .flush({ error: 'No autenticado' }, { status: 401, statusText: 'Unauthorized' });

    expect(router.serializeUrl((await resultado) as UrlTree)).toBe('/login');
    expect(auth.getToken()).toBeNull();
  });
});
