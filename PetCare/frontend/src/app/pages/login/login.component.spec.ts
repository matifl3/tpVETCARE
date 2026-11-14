import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth.service';
import { providersDePrueba, USUARIO_CLIENTE } from '../../testing/test-utils';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  /** Completa los campos del formulario signal forms como lo haría el usuario. */
  function completar(email: string, password: string): void {
    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="email"]');
    const passwordInput: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="password"]');

    emailInput.value = email;
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = password;
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  /** Dispara el submit del form; FormRoot lo intercepta y ejecuta la acción. */
  function enviar(): void {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
  }

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('con credenciales correctas guarda el token y va al dashboard', async () => {
    completar('ana@test.com', '123456');
    enviar();

    http
      .expectOne((r) => r.url.endsWith('/api/auth/login'))
      .flush({ ...USUARIO_CLIENTE, token: 'token-123' });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(TestBed.inject(AuthService).getToken()).toBe('token-123');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('con credenciales incorrectas muestra el error', async () => {
    completar('ana@test.com', 'mal');
    enviar();

    http
      .expectOne((r) => r.url.endsWith('/api/auth/login'))
      .flush({ error: 'Credenciales inválidas' }, { status: 401, statusText: 'Unauthorized' });

    await fixture.whenStable();
    fixture.detectChanges();

    // El interceptor normaliza el error a un `Error`; el componente muestra su mensaje genérico.
    const alerta: HTMLElement = fixture.nativeElement.querySelector('.alert-error');
    expect(alerta.textContent).toContain('Correo o contraseña incorrectos.');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
