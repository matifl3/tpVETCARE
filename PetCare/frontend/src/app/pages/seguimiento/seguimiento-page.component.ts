import { Location } from '@angular/common';
import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { inputValue } from '../../core/form.helpers';
import { Seguimiento } from '../../core/models';
import { SeguimientoService } from '../../services/seguimiento.service';

interface ProgresoForm {
  descripcion: string;
  tecnicas: string;
  observaciones: string;
  evaluacion: string;
}

const FORM_VACIO: ProgresoForm = { descripcion: '', tecnicas: '', observaciones: '', evaluacion: '' };

@Component({
  selector: 'app-seguimiento-page',
  standalone: true,
  templateUrl: './seguimiento-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './seguimiento-page.component.css',
})
export class SeguimientoPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly auth = inject(AuthService);
  private readonly seguimientoService = inject(SeguimientoService);

  protected readonly inputValue = inputValue;

  private idMascota = 0;
  private readonly user = this.auth.user();
  protected readonly esAdiestradorOAdmin = this.user?.rol === 'ADIESTRADOR' || this.user?.rol === 'ADMIN';

  readonly seguimiento = signal<Seguimiento | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly mostrarForm = signal(false);
  readonly form = signal<ProgresoForm>({ ...FORM_VACIO });

  ngOnInit(): void {
    this.idMascota = Number(this.route.snapshot.paramMap.get('idMascota'));
    this.cargar();
  }

  upd(patch: Partial<ProgresoForm>): void {
    this.form.set({ ...this.form(), ...patch });
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

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.error.set('');
    this.success.set('');
    this.seguimientoService.registrarProgreso(this.idMascota, { ...this.form() }).subscribe({
      next: () => {
        this.success.set('Progreso registrado correctamente');
        this.form.set({ ...FORM_VACIO });
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: (err) => this.error.set(err.message),
    });
  }
}
