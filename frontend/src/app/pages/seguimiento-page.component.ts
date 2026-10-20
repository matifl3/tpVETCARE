import { Location } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { inputValue } from '../core/form.helpers';
import { Seguimiento } from '../core/models';
import { SeguimientoService } from '../services/seguimiento.service';

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
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <div class="admin-header">
          <h1>Seguimiento de {{ seguimiento()?.nombreMascota || 'Mascota' }}</h1>
          <a href="#" (click)="volver($event)" class="btn-secondary" style="padding: 8px 20px; font-size: 13px">← Volver</a>
        </div>
        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }
        @if (success()) {
          <div class="alert alert-success show">{{ success() }}</div>
        }

        @if (esAdiestradorOAdmin) {
          <div style="margin-bottom: 24px">
            <button class="btn-primary" (click)="mostrarForm.set(!mostrarForm())">
              {{ mostrarForm() ? 'Cancelar' : '+ Registrar progreso' }}
            </button>
          </div>
        }

        @if (mostrarForm()) {
          <form (submit)="handleSubmit($event)" class="admin-card" style="margin-bottom: 24px">
            <h3>Nuevo registro de progreso</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
              <div class="input-group">
                <label>Descripción</label>
                <textarea
                  required
                  [value]="form().descripcion"
                  (input)="upd({ descripcion: inputValue($event) })"
                  style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; font-family: inherit; min-height: 80px; resize: vertical"
                ></textarea>
              </div>
              <div class="input-group">
                <label>Técnicas aplicadas</label>
                <textarea
                  required
                  [value]="form().tecnicas"
                  (input)="upd({ tecnicas: inputValue($event) })"
                  style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; font-family: inherit; min-height: 80px; resize: vertical"
                ></textarea>
              </div>
              <div class="input-group">
                <label>Observaciones</label>
                <textarea
                  [value]="form().observaciones"
                  (input)="upd({ observaciones: inputValue($event) })"
                  style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; font-family: inherit; min-height: 80px; resize: vertical"
                ></textarea>
              </div>
              <div class="input-group">
                <label>Evaluación</label>
                <select
                  required
                  [value]="form().evaluacion"
                  (change)="upd({ evaluacion: inputValue($event) })"
                  style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; font-family: inherit"
                >
                  <option value="">Seleccionar</option>
                  <option value="EXCELENTE">Excelente</option>
                  <option value="BUENO">Bueno</option>
                  <option value="REGULAR">Regular</option>
                  <option value="MALO">Malo</option>
                </select>
              </div>
            </div>
            <button type="submit" class="btn-primary" style="margin-top: 16px">Guardar registro</button>
          </form>
        }

        @if (!seguimiento()?.registros?.length) {
          <div class="admin-card">
            <p style="color: #777; text-align: center; padding: 32px">No hay registros de seguimiento para esta mascota.</p>
          </div>
        } @else {
          <div class="admin-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Profesional</th>
                  <th>Descripción</th>
                  <th>Técnicas</th>
                  <th>Observaciones</th>
                  <th>Evaluación</th>
                </tr>
              </thead>
              <tbody>
                @for (r of seguimiento()?.registros; track r.id) {
                  <tr>
                    <td>{{ r.fecha }}</td>
                    <td>{{ r.nombreProfesional }}</td>
                    <td>{{ r.descripcion }}</td>
                    <td>{{ r.tecnicas }}</td>
                    <td>{{ r.observaciones || '—' }}</td>
                    <td><span class="nav-role">{{ r.evaluacion }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    }
  `,
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
