import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MensajeAlertaComponent } from '../../../shared/mensaje-alerta/mensaje-alerta.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  Mascota,
  Profesional,
  ROLES_CON_HORAS,
  esRolProfesional,
  capitalizar,
} from '../../../core/models';
import { CarritoService } from '../../../services/carrito.service';
import { MascotaService } from '../../../services/mascota.service';
import { ProfesionalService } from '../../../services/profesional.service';
import { TurnoService } from '../../../services/turno.service';

export function hoyISO(): string {
  return new Date().toLocaleDateString(
    'en-CA',
  ); /**Devuelve la fecha de hoy en formato local AAAA-MM-DD */
}

/** La fecha del turno no puede ser anterior a hoy. */
export function fechaNoPasada(
  control: AbstractControl,
): ValidationErrors | null {
  const fecha = control.value;
  if (!fecha) return null; // si está vacía, avisa el required
  return fecha < hoyISO() ? { fechaPasada: true } : null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-reservar-turno-page',
  imports: [RouterLink, ReactiveFormsModule, MensajeAlertaComponent],
  templateUrl: './reservar-turno-page.component.html',
  styleUrl: './reservar-turno-page.component.css',
})
export class ReservarTurnoPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly mascotaService = inject(MascotaService);
  private readonly turnoService = inject(TurnoService);
  private readonly carritoService = inject(CarritoService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly hoy = hoyISO();

  private readonly idProfesional =
    this.route.snapshot.paramMap.get('idProfesional') ?? '';

  readonly profesional = signal<Profesional | null>(null);
  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly enviando = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly disponible = signal<boolean | null>(null);

  protected readonly capitalizar = capitalizar;

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
  readonly horasValidas = computed(() => Math.min(Math.max(this.horas() || 1, 1), 8),);
  readonly total = computed(() => this.precioBase() + this.precioHora() * (this.horasValidas() - 1),);
  readonly permiteHoras = computed(() =>(ROLES_CON_HORAS as readonly string[]).includes(this.profesional()?.rol ?? '', ),);

  constructor() {
    this.form.controls.fecha.valueChanges.subscribe((fecha) => {
      this.disponible.set(null); // "Verificando"

      if (!fecha || this.form.controls.fecha.invalid) return; // fecha vacía o inválida return

      this.turnoService.disponibilidad(this.idProfesional, fecha).subscribe({
        next: (res) => this.disponible.set(res.disponible), // si tiene disponibilidad, reserva.
        error: () => this.disponible.set(false),
      });
    });
  }

  ngOnInit(): void {
    forkJoin([
      // el fork lanza las dos consultas en paralelo y avisa cuando llegan ambas
      this.profesionalService.buscarPorId(Number(this.idProfesional)),
      this.mascotaService.misMascotas(),
    ]).subscribe({
      next: ([prof, masc]) => {
        this.profesional.set(prof);
        this.mascotas.set(masc);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
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
