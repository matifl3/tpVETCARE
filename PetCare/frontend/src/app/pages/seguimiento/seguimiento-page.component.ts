import { Location } from '@angular/common';
import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Seguimiento } from '../../core/models';
import { SeguimientoService } from '../../services/seguimiento.service';

@Component({
  selector: 'app-seguimiento-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './seguimiento-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './seguimiento-page.component.css',
})
export class SeguimientoPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly auth = inject(AuthService);
  private readonly seguimientoService = inject(SeguimientoService);
  private readonly fb = inject(NonNullableFormBuilder);

  private idMascota = 0;
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
    this.idMascota = Number(this.route.snapshot.paramMap.get('idMascota'));
    this.cargar();
  }

  toggleForm(): void {
    this.form.reset();
    this.mostrarForm.update((v) => !v);
  }

  cargar(): void {
    this.loading.set(true);
    this.seguimientoService.obtener(this.idMascota).subscribe({
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
    this.seguimientoService.registrarProgreso(this.idMascota, this.form.getRawValue()).subscribe({
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
