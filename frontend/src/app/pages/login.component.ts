import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { inputValue } from '../core/form.helpers';

type Tab = 'login' | 'register';

interface LoginForm {
  email: string;
  password: string;
}

interface RegistroForm {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  rol: string;
  matricula: string;
  experiencia: string;
}

const REGISTRO_VACIO: RegistroForm = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  password: '',
  rol: 'CLIENTE',
  matricula: '',
  experiencia: '',
};

const ROLES_PROFESIONALES = ['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR'];

/** Login y registro (tabs de ingreso y registro). */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <nav class="navbar">
        <div class="container">
          <a routerLink="/" class="logo">
            <span class="logo-icon">🐾</span>
            <h1>PetCare</h1>
          </a>
        </div>
      </nav>

      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <div class="logo">
              <span class="logo-icon">🐾</span>
              <h1>PetCare</h1>
            </div>
            <p class="subtitulo">Accedé a tu cuenta o registrate</p>
          </div>

          @if (error()) {
            <div class="alert alert-error show">{{ error() }}</div>
          }
          @if (success()) {
            <div class="alert alert-success show">{{ success() }}</div>
          }

          <div class="tab-buttons">
            <button
              class="tab-btn"
              [class.active]="tab() === 'login'"
              (click)="switchTab('login')"
            >
              Iniciar Sesión
            </button>
            <button
              class="tab-btn"
              [class.active]="tab() === 'register'"
              (click)="switchTab('register')"
            >
              Registrarse
            </button>
          </div>

          @if (tab() === 'login') {
            <div class="form-container active">
              <form (submit)="handleLogin($event)">
                <div class="input-group">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="tu@correo.com"
                    required
                    [value]="loginForm().email"
                    (input)="updLogin({ email: inputValue($event) })"
                  />
                </div>
                <div class="input-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    [value]="loginForm().password"
                    (input)="updLogin({ password: inputValue($event) })"
                  />
                </div>
                <button type="submit" class="btn-primary" [disabled]="loading()">
                  {{ loading() ? 'Ingresando...' : 'Iniciar Sesión' }}
                </button>
                <p class="form-footer">
                  ¿No tenés cuenta?
                  <span class="link" (click)="selectTab('register')">Registrate</span>
                </p>
              </form>
            </div>
          }

          @if (tab() === 'register') {
            <div class="form-container active">
              <form (submit)="handleRegistro($event)">
                <div class="input-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    placeholder="Juan"
                    required
                    [value]="regForm().nombre"
                    (input)="updReg({ nombre: inputValue($event) })"
                  />
                </div>
                <div class="input-group">
                  <label>Apellido</label>
                  <input
                    type="text"
                    placeholder="Pérez"
                    required
                    [value]="regForm().apellido"
                    (input)="updReg({ apellido: inputValue($event) })"
                  />
                </div>
                <div class="input-group">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="tu@correo.com"
                    required
                    [value]="regForm().email"
                    (input)="updReg({ email: inputValue($event) })"
                  />
                </div>
                <div class="input-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    placeholder="11 1234-5678"
                    required
                    [value]="regForm().telefono"
                    (input)="updReg({ telefono: inputValue($event) })"
                  />
                </div>
                <div class="input-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    minlength="6"
                    required
                    [value]="regForm().password"
                    (input)="updReg({ password: inputValue($event) })"
                  />
                </div>

                <p class="form-footer">
                  Te estás registrando como <strong>Cliente</strong>.
                  <span class="link" (click)="toggleProfesional()">
                    {{ mostrarProfesional() ? 'Soy cliente' : '¿Sos profesional?' }}
                  </span>
                </p>

                @if (mostrarProfesional()) {
                  <div>
                    <div class="role-selector">
                      <label class="role-label">Rol profesional</label>
                      <div class="role-options">
                        @for (r of rolesProfesionales; track r) {
                          <label class="role-card">
                            <input
                              type="radio"
                              name="rolProfesional"
                              [value]="r"
                              [checked]="regForm().rol === r"
                              (change)="updReg({ rol: r })"
                            />
                            <div class="role-content">
                              <span class="role-text">{{ r.charAt(0) + r.slice(1).toLowerCase() }}</span>
                            </div>
                          </label>
                        }
                      </div>
                    </div>
                    <div class="input-group">
                      <label>Matrícula / N° de registro</label>
                      <input
                        type="text"
                        placeholder="Ingresá tu matrícula"
                        [value]="regForm().matricula"
                        (input)="updReg({ matricula: inputValue($event) })"
                      />
                    </div>
                    <div class="input-group">
                      <label>Experiencia</label>
                      <input
                        type="text"
                        placeholder="Ej: 3 años como veterinario"
                        [value]="regForm().experiencia"
                        (input)="updReg({ experiencia: inputValue($event) })"
                      />
                    </div>
                    <div class="register-note">
                      💡 <strong>Importante:</strong> Un administrador revisará y aprobará tu solicitud antes de que puedas operar.
                    </div>
                  </div>
                }

                <button type="submit" class="btn-primary" [disabled]="loading()">
                  {{ loading() ? 'Registrando...' : 'Crear Cuenta' }}
                </button>
                <p class="form-footer">
                  ¿Ya tenés cuenta?
                  <span class="link" (click)="selectTab('login')">Iniciar sesión</span>
                </p>
              </form>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly inputValue = inputValue;
  protected readonly rolesProfesionales = ROLES_PROFESIONALES;

  readonly tab = signal<Tab>('login');
  readonly error = signal('');
  readonly success = signal('');
  readonly loading = signal(false);
  readonly mostrarProfesional = signal(false);
  readonly loginForm = signal<LoginForm>({ email: '', password: '' });
  readonly regForm = signal<RegistroForm>({ ...REGISTRO_VACIO });

  updLogin(patch: Partial<LoginForm>): void {
    this.loginForm.set({ ...this.loginForm(), ...patch });
  }

  updReg(patch: Partial<RegistroForm>): void {
    this.regForm.set({ ...this.regForm(), ...patch });
  }

  /** Cambia de tab limpiando los mensajes (botones superiores). */
  switchTab(tab: Tab): void {
    this.tab.set(tab);
    this.error.set('');
    this.success.set('');
  }

  /** Cambia de tab desde los links del formulario (sin tocar los mensajes). */
  selectTab(tab: Tab): void {
    this.tab.set(tab);
  }

  toggleProfesional(): void {
    this.mostrarProfesional.update((v) => !v);
  }

  handleLogin(event: Event): void {
    event.preventDefault();
    this.error.set('');
    this.loading.set(true);
    const { email, password } = this.loginForm();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.message || 'Credenciales inválidas');
        this.loading.set(false);
      },
    });
  }

  handleRegistro(event: Event): void {
    event.preventDefault();
    this.error.set('');
    this.loading.set(true);

    const data: Record<string, any> = { ...this.regForm() };
    if (data['rol'] === 'CLIENTE') {
      delete data['matricula'];
      delete data['experiencia'];
    }

    this.auth.registro(data).subscribe({
      next: (json) => {
        this.loading.set(false);
        this.success.set(json.mensaje || 'Registro exitoso');
        this.regForm.set({ ...REGISTRO_VACIO });
        this.mostrarProfesional.set(false);
        setTimeout(() => this.tab.set('login'), 1500);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
