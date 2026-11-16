import { Location } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Seguimiento } from '../../core/models';
import { SeguimientoService } from '../../services/seguimiento.service';
import { MensajeAlertaComponent } from '../../shared/mensaje-alerta/mensaje-alerta.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-seguimiento-page',
  standalone: true,
  imports: [ReactiveFormsModule, MensajeAlertaComponent],
  templateUrl: './seguimiento-page.component.html',
  styleUrl: './seguimiento-page.component.css',
})
export class SeguimientoPageComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly auth = inject(AuthService);
  private readonly seguimientoService = inject(SeguimientoService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  readonly idMascota = input.required<string>();
  private readonly user = this.auth.user();
  protected readonly esAdiestradorOAdmin = this.user?.rol === 'ADIESTRADOR' || this.user?.rol === 'ADMIN';

  readonly seguimiento = signal<Seguimiento | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly mostrarForm = signal(false);

  readonly form = this.fb.group({
    descripcion: ['', [Validators.required, Validators.maxLength(500)]],
    tecnicas: ['', [Validators.required, Validators.maxLength(500)]],
    observaciones: ['', Validators.maxLength(500)], // opcional
    evaluacion: ['', Validators.required],
  });

  ngOnInit(): void {
    this.cargar();
  }

  toggleForm(): void {
    this.form.reset();
    this.mostrarForm.update((v) => !v);
  }

  cargar(): void {
    this.loading.set(true);
    this.seguimientoService
      .obtener(Number(this.idMascota()))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (data) => {
        this.seguimiento.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  /** "← Volver" vuelve a la página anterior. */
  volver(event: Event): void {
    event.preventDefault();
    this.location.back();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set('');
    this.success.set('');
    this.seguimientoService
      .registrarProgreso(Number(this.idMascota()), this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => {
        this.success.set('Progreso registrado correctamente');
        this.form.reset();
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: (err) => this.error.set(err.message),
    });
  }
}
