import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { Profesional, ROL_LABELS_PERFIL } from '../../../core/models';
import { ProfesionalService } from '../../../services/profesional.service';
import { UsuarioService } from '../../../services/usuario.service';
import { MensajeAlertaComponent } from '../../../shared/mensaje-alerta/mensaje-alerta.component';

/**
 * Validador de GRUPO: mira dos campos juntos.
 * La nueva contraseña y la repetida tienen que ser iguales.
 */
function passwordsIguales(grupo: AbstractControl): ValidationErrors | null {
  const nueva = grupo.get('nueva')?.value;
  const repetir = grupo.get('repetir')?.value;
  if (!nueva || !repetir) return null; // si falta alguna, avisa el required de cada campo
  return nueva !== repetir ? { noCoinciden: true } : null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-perfil-profesional-page',
    imports: [RouterLink, MensajeAlertaComponent, ReactiveFormsModule],
    templateUrl: './perfil-profesional-page.component.html',
    styleUrl: './perfil-profesional-page.component.css'
})
export class PerfilProfesionalPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly rolLabels = ROL_LABELS_PERFIL;

  readonly perfil = signal<Profesional | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  // Cambio de contraseña
  readonly mostrarPassword = signal(false);
  readonly passwordError = signal('');
  readonly passwordOk = signal('');
  readonly guardandoPassword = signal(false);

  readonly passwordForm = this.fb.group(
    {
      actual: ['', Validators.required],
      nueva: ['', [Validators.required, Validators.minLength(6)]],
      repetir: ['', Validators.required],
    },
    { validators: passwordsIguales },
  );

  togglePassword(): void {
    this.mostrarPassword.update((v) => !v);
    this.passwordForm.reset();
    this.passwordError.set('');
    this.passwordOk.set('');
  }

  cambiarPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { actual, nueva } = this.passwordForm.getRawValue();
    this.passwordError.set('');
    this.passwordOk.set('');
    this.guardandoPassword.set(true);
    this.usuarioService.cambiarMiPassword(actual, nueva).subscribe({
      next: (res) => {
        this.guardandoPassword.set(false);
        this.passwordOk.set(res.mensaje);
        this.passwordForm.reset();
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
