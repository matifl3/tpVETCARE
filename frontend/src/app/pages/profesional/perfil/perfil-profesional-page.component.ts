import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { Profesional } from '../../../core/models';
import { ProfesionalService } from '../../../services/profesional.service';
import { UsuarioService } from '../../../services/usuario.service';
import { inputValue } from '../../../core/form.helpers';

interface PasswordForm {
  actual: string;
  nueva: string;
  repetir: string;
}

const PASSWORD_FORM_VACIO: PasswordForm = { actual: '', nueva: '', repetir: '' };

const ROL_LABELS: Record<string, string> = {
  VETERINARIO: 'Veterinario',
  PASEADOR: 'Paseador',
  PELUQUERO: 'Peluquero',
  ADIESTRADOR: 'Adiestrador',
  CUIDADOR: 'Cuidador',
};

@Component({
    selector: 'app-perfil-profesional-page',
    imports: [RouterLink],
    templateUrl: './perfil-profesional-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './perfil-profesional-page.component.css'
})
export class PerfilProfesionalPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly usuarioService = inject(UsuarioService);

  protected readonly rolLabels = ROL_LABELS;
  protected readonly inputValue = inputValue;

  readonly perfil = signal<Profesional | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  // Cambio de contraseña
  readonly mostrarPassword = signal(false);
  readonly passwordForm = signal<PasswordForm>({ ...PASSWORD_FORM_VACIO });
  readonly passwordError = signal('');
  readonly passwordOk = signal('');
  readonly guardandoPassword = signal(false);

  updPassword(patch: Partial<PasswordForm>): void {
    this.passwordForm.update((f) => ({ ...f, ...patch }));
  }

  togglePassword(): void {
    this.mostrarPassword.update((v) => !v);
    this.passwordForm.set({ ...PASSWORD_FORM_VACIO });
    this.passwordError.set('');
    this.passwordOk.set('');
  }

  cambiarPassword(event: Event): void {
    event.preventDefault();
    const { actual, nueva, repetir } = this.passwordForm();
    this.passwordError.set('');
    this.passwordOk.set('');

    if (!actual || !nueva || !repetir) {
      this.passwordError.set('Completá todos los campos');
      return;
    }
    if (nueva.length < 6) {
      this.passwordError.set('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (nueva !== repetir) {
      this.passwordError.set('Las contraseñas nuevas no coinciden');
      return;
    }

    this.guardandoPassword.set(true);
    this.usuarioService.cambiarMiPassword(actual, nueva).subscribe({
      next: (res) => {
        this.guardandoPassword.set(false);
        this.passwordOk.set(res.mensaje);
        this.passwordForm.set({ ...PASSWORD_FORM_VACIO });
        this.mostrarPassword.set(false);
      },
      error: (err) => {
        this.guardandoPassword.set(false);
        this.passwordError.set(err.message);
      },
    });
  }

  ngOnInit(): void {
    this.profesionalService.buscarPorId(this.auth.user()!.id).subscribe({
      next: (data) => {
        this.perfil.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
