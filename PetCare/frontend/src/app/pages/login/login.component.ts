import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { inputValue } from '../../core/form.helpers';

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
    imports: [RouterLink],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './login.component.css'
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
