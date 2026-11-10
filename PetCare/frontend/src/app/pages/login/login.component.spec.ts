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

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('con credenciales correctas guarda el token y va al dashboard', () => {
    component.updLogin({ email: 'ana@test.com', password: '123456' });
    component.handleLogin(new Event('submit'));

    http.expectOne('/api/auth/login').flush({ ...USUARIO_CLIENTE, token: 'token-123' });

    expect(TestBed.inject(AuthService).getToken()).toBe('token-123');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('con credenciales incorrectas muestra el error', () => {
    component.updLogin({ email: 'ana@test.com', password: 'mal' });
    component.handleLogin(new Event('submit'));

    http
      .expectOne('/api/auth/login')
      .flush({ error: 'Credenciales inválidas' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();

    const alerta: HTMLElement = fixture.nativeElement.querySelector('.alert-error');
    expect(alerta.textContent).toContain('Credenciales inválidas');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
