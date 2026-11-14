import { Location } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private readonly location = inject(Location);
  private readonly auth = inject(AuthService);
  private readonly seguimientoService = inject(SeguimientoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly inputValue = inputValue;

  /** Parámetro `:idMascota` de la URL (con withComponentInputBinding). */
  readonly idMascota = input.required<string>();
  private readonly idMascotaNum = computed(() => Number(this.idMascota()));
  private readonly user = this.auth.user;
  protected readonly esAdiestradorOAdmin = computed(
    () => this.user()?.rol === 'ADIESTRADOR' || this.user()?.rol === 'ADMIN',
  );

  readonly seguimiento = signal<Seguimiento | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly mostrarForm = signal(false);
  readonly form = signal<ProgresoForm>({ ...FORM_VACIO });

  ngOnInit(): void {
    this.cargar();
  }

  upd(patch: Partial<ProgresoForm>): void {
    this.form.set({ ...this.form(), ...patch });
  }

  cargar(): void {
    this.loading.set(true);
    this.seguimientoService
      .obtener(this.idMascotaNum())
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

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.error.set('');
    this.success.set('');
    this.seguimientoService
      .registrarProgreso(this.idMascotaNum(), { ...this.form() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
