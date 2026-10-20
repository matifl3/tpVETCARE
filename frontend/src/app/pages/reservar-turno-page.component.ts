import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { inputValue } from '../core/form.helpers';
import { Mascota, Profesional } from '../core/models';
import { CarritoService } from '../services/carrito.service';
import { MascotaService } from '../services/mascota.service';
import { ProfesionalService } from '../services/profesional.service';
import { TurnoService } from '../services/turno.service';

const ROLES_CON_HORAS = ['PASEADOR', 'CUIDADOR'];

@Component({
  selector: 'app-reservar-turno-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <h1>Reservar turno</h1>

        @if (profesional(); as prof) {
          <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin-bottom: 24px; display: flex; align-items: center; gap: 16px">
            <span style="font-size: 40px">👨‍⚕️</span>
            <div>
              <h3>{{ prof.nombre }} {{ prof.apellido }}</h3>
              <p style="color: #777">{{ capitalizar(prof.rol) }}</p>
              @if (prof.experiencia) {
                <p style="color: #777; font-size: 13px">{{ prof.experiencia }}</p>
              }
            </div>
          </div>
        }

        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }
        @if (success()) {
          <div class="alert alert-success show">{{ success() }}</div>
        }

        <form (submit)="handleSubmit($event)" style="max-width: 500px">
          <div class="input-group">
            <label>Mascota</label>
            <select
              (change)="idMascota.set(inputValue($event))"
              required
              style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; font-family: inherit"
            >
              <option value="" [selected]="idMascota() === ''">Seleccionar mascota</option>
              @for (m of mascotas(); track m.idMascota) {
                <option [value]="m.idMascota" [selected]="idMascota() === String(m.idMascota)">
                  {{ m.nombre }} ({{ m.especie }})
                </option>
              }
            </select>
          </div>

          <div class="input-group">
            <label>Fecha del turno</label>
            <input type="date" [value]="fecha()" (input)="onFecha(inputValue($event))" required [min]="hoy" />
          </div>

          @if (fecha()) {
            <div style="margin-bottom: 16px">
              @if (disponible() === null) {
                <p style="color: #777">Verificando disponibilidad...</p>
              } @else if (disponible()) {
                <p style="color: #388e3c; font-weight: 600">✓ Profesional disponible en esa fecha</p>
              } @else {
                <p style="color: #d32f2f; font-weight: 600">✕ El profesional no está disponible en esa fecha</p>
              }
            </div>
          }

          @if (permiteHoras()) {
            <div class="input-group">
              <label>Horas de servicio</label>
              <input type="number" min="1" max="8" [value]="horas()" (input)="onHoras(inputValue($event))" />
              <p style="font-size: 13px; color: #777; margin-top: 4px">Cargo adicional por hora extra: \${{ precioHora().toFixed(2) }}</p>
            </div>
          }

          <div style="background: #f0f0ff; padding: 16px; border-radius: 12px; margin-bottom: 24px">
            <h3>Resumen del turno</h3>
            @if (permiteHoras()) {
              <p>Precio base: \${{ precioBase().toFixed(2) }}</p>
            }
            @if (permiteHoras() && horas() > 1) {
              <p>
                Horas extra: {{ horas() - 1 }} × \${{ precioHora().toFixed(2) }} = \${{ (precioHora() * (horas() - 1)).toFixed(2) }}
              </p>
            }
            <p style="font-size: 20px; font-weight: 700; color: #667eea; margin-top: 8px">Total: \${{ total().toFixed(2) }}</p>
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="enviando() || !disponible() || !fecha() || !idMascota()"
          >
            {{ enviando() ? 'Agregando...' : 'Agregar al carrito' }}
          </button>
        </form>

        <a routerLink="/dashboard/profesionales" class="btn-secondary" style="margin-top: 24px; display: inline-block">← Volver a profesionales</a>
      </div>
    }
  `,
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
        precio: this.total(),
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
