import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, debounce, distinctUntilChanged, forkJoin, map, of, switchMap, timer } from 'rxjs';
import { inputValue } from '../../../core/form.helpers';
import { Mascota, Profesional } from '../../../core/models';
import { NombreRolPipe } from '../../../core/pipes/nombre-rol.pipe';
import { despuesDe } from '../../../core/tiempo.helpers';
import { CarritoService } from '../../../services/carrito.service';
import { MascotaService } from '../../../services/mascota.service';
import { ProfesionalService } from '../../../services/profesional.service';
import { TurnoService } from '../../../services/turno.service';

const ROLES_CON_HORAS = ['PASEADOR', 'CUIDADOR'];

@Component({
    selector: 'app-reservar-turno-page',
    imports: [RouterLink, NombreRolPipe],
    templateUrl: './reservar-turno-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './reservar-turno-page.component.css'
})
export class ReservarTurnoPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly mascotaService = inject(MascotaService);
  private readonly turnoService = inject(TurnoService);
  private readonly carritoService = inject(CarritoService);

  protected readonly inputValue = inputValue;
  protected readonly String = String;
  protected readonly hoy = new Date().toISOString().split('T')[0];

  private readonly idProfesional = this.route.snapshot.paramMap.get('idProfesional') ?? '';

  readonly profesional = signal<Profesional | null>(null);
  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly enviando = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  readonly fecha = signal('');
  readonly horas = signal(1);
  readonly idMascota = signal('');

  readonly precioBase = computed(() => this.profesional()?.precioBase || 0);
  readonly precioHora = computed(() => this.profesional()?.precioHora || 0);
  readonly total = computed(() => this.precioBase() + this.precioHora() * (Math.max(this.horas(), 1) - 1));
  readonly permiteHoras = computed(() => ROLES_CON_HORAS.includes(this.profesional()?.rol ?? ''));

  /**
   * Disponibilidad del profesional para la fecha elegida.
   * El debounce evita consultar en cada tecla, `distinctUntilChanged` evita
   * repetir la misma fecha y `switchMap` cancela la consulta anterior. Al
   * destruirse el componente, `toSignal` corta la suscripción y con ella el
   * pedido pendiente.
   */
  private readonly disponibilidad$ = toObservable(this.fecha).pipe(
    debounce((fecha) => timer(fecha ? 500 : 0)),
    distinctUntilChanged(),
    switchMap((fecha) =>
      fecha
        ? this.turnoService.disponibilidad(this.idProfesional, fecha).pipe(
            map((res) => res?.disponible ?? false),
            catchError(() => of(false)),
          )
        : of(null),
    ),
  );

  readonly disponible = toSignal(this.disponibilidad$, { initialValue: null });

  ngOnInit(): void {
    forkJoin([
      this.profesionalService.buscarPorId(Number(this.idProfesional)),
      this.mascotaService.misMascotas(),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([prof, masc]) => {
          this.profesional.set(prof);
          this.mascotas.set(masc);
          if (masc.length > 0) this.idMascota.set(String(masc[0].idMascota));
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }

  onFecha(fecha: string): void {
    this.fecha.set(fecha);
  }

  onHoras(valor: string): void {
    this.horas.set(parseInt(valor) || 1);
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (!this.disponible()) return;
    this.error.set('');
    this.success.set('');
    this.enviando.set(true);
    this.carritoService
      .agregarTurno({
        idProfesional: Number(this.idProfesional),
        idMascota: Number(this.idMascota()),
        fecha: this.fecha(),
        horas: this.permiteHoras() ? Number(this.horas()) : 1,

      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.success.set('Turno agregado al carrito');
          despuesDe(1500, this.destroyRef).subscribe(() =>
            this.router.navigate(['/dashboard/carrito']),
          );
        },
        error: (err) => {
          this.error.set(err.message);
          this.enviando.set(false);
        },
      });
  }
}
