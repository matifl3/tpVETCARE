import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profesional } from '../core/models';
import { ProfesionalService } from '../services/profesional.service';

const ROLES = ['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR'];

@Component({
  selector: 'app-profesionales-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <h1>Profesionales</h1>
        <p style="margin-bottom: 24px">Buscá profesionales para el cuidado de tus mascotas.</p>

        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }

        <div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap">
          <button [class]="'btn-' + (filtroRol() === '' ? 'primary' : 'secondary')" (click)="handleFiltrar('')">
            Todos
          </button>
          @for (r of roles; track r) {
            <button [class]="'btn-' + (filtroRol() === r ? 'primary' : 'secondary')" (click)="handleFiltrar(r)">
              {{ capitalizar(r) }}
            </button>
          }
        </div>

        @if (profesionales().length === 0) {
          <p style="color: #777">No se encontraron profesionales.</p>
        } @else {
          <div class="card-grid">
            @for (p of profesionales(); track p.id) {
              <div class="dash-card" style="display: flex; flex-direction: column; justify-content: space-between">
                <div>
                  <span class="dash-icon">👨‍⚕️</span>
                  <h3>{{ p.nombre }} {{ p.apellido }}</h3>
                  <p><strong>Rol:</strong> {{ capitalizar(p.rol) }}</p>
                  @if (p.matricula) {
                    <p><strong>Matrícula:</strong> {{ p.matricula }}</p>
                  }
                  @if (p.experiencia) {
                    <p><strong>Experiencia:</strong> {{ p.experiencia }}</p>
                  }
                  @if (p.precioBase != null) {
                    <p style="font-size: 16px; font-weight: 700; color: #667eea; margin-top: 8px">
                      Desde \${{ p.precioBase.toFixed(2) }}
                    </p>
                  }
                </div>
                <a
                  [routerLink]="['/dashboard/profesionales/reservar', p.id]"
                  class="btn-primary"
                  style="margin-top: 12px; text-align: center"
                >
                  Reservar turno
                </a>
              </div>
            }
          </div>
        }

        <a routerLink="/dashboard" class="btn-secondary" style="margin-top: 24px; display: inline-block">← Volver al Dashboard</a>
      </div>
    }
  `,
})
export class ProfesionalesPageComponent implements OnInit {
  private readonly profesionalService = inject(ProfesionalService);

  protected readonly roles = ROLES;

  readonly profesionales = signal<Profesional[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly filtroRol = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(rol?: string): void {
    this.loading.set(true);
    const req = rol ? this.profesionalService.porRol(rol) : this.profesionalService.listar();
    req.subscribe({
      next: (data) => {
        this.profesionales.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  handleFiltrar(rol: string): void {
    this.filtroRol.set(rol);
    this.cargar(rol);
  }

  capitalizar(r: string | undefined): string {
    return r ? r.charAt(0) + r.slice(1).toLowerCase() : '';
  }
}
