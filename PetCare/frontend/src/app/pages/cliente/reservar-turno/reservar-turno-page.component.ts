import { Component, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MensajeAlertaComponent } from '../../../shared/mensaje-alerta/mensaje-alerta.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, debounceTime, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { Mascota, Profesional } from '../../../core/models';
import { CarritoService } from '../../../services/carrito.service';
import { MascotaService } from '../../../services/mascota.service';
import { ProfesionalService } from '../../../services/profesional.service';
import { TurnoService } from '../../../services/turno.service';

const ROLES_CON_HORAS = ['PASEADOR', 'CUIDADOR'];

const HOY = new Date().toISOString().split('T')[0];

/** Validador propio: la fecha del turno no puede ser anterior a hoy. */
function fechaNoPasada(control: AbstractControl): ValidationErrors | null {
  const fecha = control.value;
  if (!fecha) return null; // si está vacía, avisa el required
  return fecha < HOY ? { fechaPasada: true } : null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-reservar-turno-page',
    imports: [RouterLink, ReactiveFormsModule, MensajeAlertaComponent],
    templateUrl: './reservar-turno-page.component.html',
    styleUrl: './reservar-turno-page.component.css'
})
export class ReservarTurnoPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly mascotaService = inject(MascotaService);
  private readonly turnoService = inject(TurnoService);
  private readonly carritoService = inject(CarritoService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly hoy = HOY;

  private readonly idProfesional = this.route.snapshot.paramMap.get('idProfesional') ?? '';

  readonly profesional = signal<Profesional | null>(null);
  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly enviando = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly disponible = signal<boolean | null>(null);

  readonly form = this.fb.group({
    idMascota: this.fb.control<number | null>(null, Validators.required),
    fecha: ['', [Validators.required, fechaNoPasada]],
    horas: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
  });

  /** Las horas del formulario como signal, para poder usarlas en el computed del total. */
  private readonly horas = toSignal(this.form.controls.horas.valueChanges, {
    initialValue: this.form.controls.horas.value,
  });

  readonly precioBase = computed(() => this.profesional()?.precioBase || 0);
  readonly precioHora = computed(() => this.profesional()?.precioHora || 0);
  readonly horasValidas = computed(() => Math.min(Math.max(this.horas() || 1, 1), 8));
  readonly total = computed(() => this.precioBase() + this.precioHora() * (this.horasValidas() - 1));
  readonly permiteHoras = computed(() => ROLES_CON_HORAS.includes(this.profesional()?.rol ?? ''));

  constructor() {
    // Cada vez que cambia la fecha, consultamos la disponibilidad.
    this.form.controls.fecha.valueChanges
      .pipe(
        tap(() => this.disponible.set(null)), // "Verificando..."
        debounceTime(500), // espera a que el usuario deje de escribir
        switchMap((fecha) => {
          if (!fecha || this.form.controls.fecha.invalid) return of(null);
          return this.turnoService.disponibilidad(this.idProfesional, fecha).pipe(
            map((res) => res.disponible),
            catchError(() => of(false)),
          );
        }),
        takeUntilDestroyed(), // se desuscribe solo al salir de la página
      )
      .subscribe((disponible) => this.disponible.set(disponible));
  }

  ngOnInit(): void {
    forkJoin([
      this.profesionalService.buscarPorId(Number(this.idProfesional)),
      this.mascotaService.misMascotas(),
    ]).subscribe({
      next: ([prof, masc]) => {
        this.profesional.set(prof);
        this.mascotas.set(masc);
        if (masc.length > 0) this.form.patchValue({ idMascota: masc[0].idMascota });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  capitalizar(r: string | undefined): string {
    return r ? r.charAt(0) + r.slice(1).toLowerCase() : '';
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.disponible()) return;

    const { idMascota, fecha, horas } = this.form.getRawValue();
    this.error.set('');
    this.success.set('');
    this.enviando.set(true);
    this.carritoService
      .agregarTurno({
        idProfesional: Number(this.idProfesional),
        idMascota: Number(idMascota),
        fecha,
        horas: this.permiteHoras() ? horas : 1,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.success.set('Turno agregado al carrito');
          setTimeout(() => this.router.navigate(['/dashboard/carrito']), 1500);
        },
        error: (err) => {
          this.error.set(err.message);
          this.enviando.set(false);
        },
      });
  }
}
