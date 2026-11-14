import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from './auth.service';
import { ROLES_ADMIN, ROLES_CLIENTE, ROLES_PROFESIONALES } from './roles';
import {
  providersDePrueba,
  USUARIO_ADMIN,
  USUARIO_CLIENTE,
  USUARIO_PROFESIONAL,
} from '../testing/test-utils';

describe('roleGuard', () => {
  let auth: AuthService;
  let router: Router;

  const ejecutarGuard = (roles?: readonly string[]) =>
    TestBed.runInInjectionContext(() =>
      roleGuard(
        { data: roles ? { roles } : {} } as unknown as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: providersDePrueba() });
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('deja pasar al rol permitido', () => {
    auth.user.set(USUARIO_ADMIN);
    expect(ejecutarGuard(ROLES_ADMIN)).toBeTrue();
  });

  it('manda al dashboard si el rol no está permitido', () => {
    auth.user.set(USUARIO_CLIENTE);

    const resultado = ejecutarGuard(ROLES_ADMIN) as UrlTree;

    expect(router.serializeUrl(resultado)).toBe('/dashboard');
  });

  it('un profesional no entra a una pantalla de cliente', () => {
    auth.user.set(USUARIO_PROFESIONAL);

    const resultado = ejecutarGuard(ROLES_CLIENTE) as UrlTree;

    expect(router.serializeUrl(resultado)).toBe('/dashboard');
  });

  it('un cliente no entra a una pantalla de profesional', () => {
    auth.user.set(USUARIO_CLIENTE);

    const resultado = ejecutarGuard(ROLES_PROFESIONALES) as UrlTree;

    expect(router.serializeUrl(resultado)).toBe('/dashboard');
  });

  it('sin usuario manda al login', () => {
    const resultado = ejecutarGuard(ROLES_ADMIN) as UrlTree;

    expect(router.serializeUrl(resultado)).toBe('/login');
  });

  it('sin roles configurados deja pasar', () => {
    auth.user.set(USUARIO_CLIENTE);
    expect(ejecutarGuard()).toBeTrue();
  });
});
