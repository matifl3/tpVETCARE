import { Component, OnDestroy, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { inputValue } from '../../../core/form.helpers';
import { Mascota, Profesional } from '../../../core/models';
import { CarritoService } from '../../../services/carrito.service';
import { MascotaService } from '../../../services/mascota.service';
import { ProfesionalService } from '../../../services/profesional.service';
import { TurnoService } from '../../../services/turno.service';

const ROLES_CON_HORAS = ['PASEADOR', 'CUIDADOR'];

@Component({
    selector: 'app-reservar-turno-page',
    imports: [RouterLink],
    templateUrl: './reservar-turno-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './reservar-turno-page.component.css'
})
export class ReservarTurnoPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profesionalService = inject(ProfesionalService);
  private readonly mascotaService = inject(MascotaService);
  private readonly turnoService = inject(TurnoService);
  private readonly carritoService = inject(CarritoService);

  protected readonly inputValue = inputValue;
  protected readonly String = String;
  protected readonly hoy = new Date().toISOString().split('T')[0];

  private idProfesional = '';
  private timer: ReturnType<typeof setTimeout> | undefined;

  readonly profesional = signal<Profesional | null>(null);
  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly enviando = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  readonly fecha = signal('');
  readonly horas = signal(1);
  readonly idMascota = signal('');
  readonly disponible = signal<boolean | null>(null);

  readonly precioBase = computed(() => this.profesional()?.precioBase || 0);
  readonly precioHora = computed(() => this.profesional()?.precioHora || 0);
  readonly total = computed(() => this.precioBase() + this.precioHora() * (Math.max(this.horas(), 1) - 1));
  readonly permiteHoras = computed(() => ROLES_CON_HORAS.includes(this.profesional()?.rol ?? ''));

  ngOnInit(): void {
    this.idProfesional = this.route.snapshot.paramMap.get('idProfesional') ?? '';
    forkJoin([
      this.profesionalService.buscarPorId(Number(this.idProfesional)),
      this.mascotaService.misMascotas(),
    ]).subscribe({
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

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  /** Consulta de disponibilidad con debounce de 500 ms. */
  onFecha(fecha: string): void {
    this.fecha.set(fecha);
    clearTimeout(this.timer);
    if (!fecha) {
      this.disponible.set(null);
      return;
    }
    this.timer = setTimeout(() => {
      this.turnoService.disponibilidad(this.idProfesional, fecha).subscribe({
        next: (res) => this.disponible.set(res.disponible),
        error: () => this.disponible.set(false),
      });
    }, 500);
  }

  onHoras(valor: string): void {
    this.horas.set(parseInt(valor) || 1);
  }

  capitalizar(r: string | undefined): string {
    return r ? r.charAt(0) + r.slice(1).toLowerCase() : '';
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
