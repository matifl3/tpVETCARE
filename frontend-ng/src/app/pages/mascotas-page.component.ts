import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inputValue } from '../core/form.helpers';
import { Mascota } from '../core/models';
import { MascotaService } from '../services/mascota.service';

interface MascotaForm {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  peso: string;
  fechaNacimiento: string;
}

const FORM_VACIO: MascotaForm = {
  nombre: '',
  especie: 'PERRO',
  raza: '',
  sexo: '',
  peso: '',
  fechaNacimiento: '',
};

/** Equivalente a frontend/src/pages/MascotasPage.jsx */
@Component({
  selector: 'app-mascotas-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px">
          <h1>Mis Mascotas</h1>
          <button class="btn-primary" (click)="toggleForm()">
            {{ mostrarForm() ? 'Cancelar' : '+ Nueva Mascota' }}
          </button>
        </div>

        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }

        @if (mostrarForm()) {
          <form (submit)="handleSubmit($event)" style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin-bottom: 32px">
            <h3 style="margin-top: 0">{{ editandoId() ? 'Editar Mascota' : 'Nueva Mascota' }}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
              <div class="input-group">
                <label>Nombre</label>
                <input required [value]="form().nombre" (input)="upd({ nombre: inputValue($event) })" />
              </div>
              <div class="input-group">
                <label>Especie</label>
                <select
                  class="input-group"
                  [value]="form().especie"
                  (change)="upd({ especie: inputValue($event) })"
                  style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; font-family: inherit"
                >
                  <option value="PERRO">Perro</option>
                  <option value="GATO">Gato</option>
                  <option value="AVE">Ave</option>
                  <option value="PEZ">Pez</option>
                  <option value="ROEDOR">Roedor</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              <div class="input-group">
                <label>Raza</label>
                <input [value]="form().raza" (input)="upd({ raza: inputValue($event) })" />
              </div>
              <div class="input-group">
                <label>Sexo</label>
                <select
                  [value]="form().sexo"
                  (change)="upd({ sexo: inputValue($event) })"
                  style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; font-family: inherit"
                >
                  <option value="">Seleccionar</option>
                  <option value="MACHO">Macho</option>
                  <option value="HEMBRA">Hembra</option>
                </select>
              </div>
              <div class="input-group">
                <label>Peso (kg)</label>
                <input type="number" step="0.1" [value]="form().peso" (input)="upd({ peso: inputValue($event) })" />
              </div>
              <div class="input-group">
                <label>Fecha de nacimiento</label>
                <input
                  type="date"
                  [value]="form().fechaNacimiento"
                  (input)="upd({ fechaNacimiento: inputValue($event) })"
                />
              </div>
            </div>
            <button type="submit" class="btn-primary" style="margin-top: 16px">
              {{ editandoId() ? 'Guardar Cambios' : 'Guardar Mascota' }}
            </button>
          </form>
        }

        @if (mascotas().length === 0) {
          <p style="color: #777">No tenés mascotas registradas. ¡Agregá una!</p>
        } @else {
          <div class="card-grid">
            @for (m of mascotas(); track m.idMascota) {
              <div class="dash-card" style="position: relative">
                <span class="dash-icon">🐾</span>
                <h3>{{ m.nombre }}</h3>
                <p><strong>Especie:</strong> {{ m.especie }}</p>
                @if (m.raza) {
                  <p><strong>Raza:</strong> {{ m.raza }}</p>
                }
                @if (m.sexo) {
                  <p><strong>Sexo:</strong> {{ m.sexo === 'MACHO' ? 'Macho' : 'Hembra' }}</p>
                }
                @if ((m.peso ?? 0) > 0) {
                  <p><strong>Peso:</strong> {{ m.peso }} kg</p>
                }
                @if (m.fechaNacimiento) {
                  <p><strong>Nacimiento:</strong> {{ m.fechaNacimiento }}</p>
                }
                <div style="display: flex; gap: 8px; margin-top: 8px">
                  <button (click)="handleEditar(m)" class="btn-sm" style="flex: 1">Editar</button>
                  <button
                    (click)="handleEliminar(m.idMascota)"
                    class="btn-sm"
                    style="flex: 1; background: #d32f2f; color: #fff"
                  >Eliminar</button>
                  <a
                    [routerLink]="['/dashboard/mascotas', m.idMascota, 'seguimiento']"
                    class="btn-sm"
                    style="flex: 1; text-decoration: none; text-align: center; background: #667eea; color: #fff"
                  >
                    Seguimiento
                  </a>
                </div>
              </div>
            }
          </div>
        }

        <a routerLink="/dashboard" class="btn-secondary" style="margin-top: 24px; display: inline-block">← Volver al Dashboard</a>
      </div>
    }
  `,
})
export class MascotasPageComponent implements OnInit {
  private readonly mascotaService = inject(MascotaService);

  protected readonly inputValue = inputValue;

  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly mostrarForm = signal(false);
  readonly editandoId = signal<number | null>(null);
  readonly form = signal<MascotaForm>({ ...FORM_VACIO });

  ngOnInit(): void {
    this.cargarMascotas();
  }

  upd(patch: Partial<MascotaForm>): void {
    this.form.set({ ...this.form(), ...patch });
  }

  cargarMascotas(): void {
    this.loading.set(true);
    this.mascotaService.misMascotas().subscribe({
      next: (data) => {
        this.mascotas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  resetForm(): void {
    this.form.set({ ...FORM_VACIO });
    this.editandoId.set(null);
    this.mostrarForm.set(false);
  }

  toggleForm(): void {
    if (this.mostrarForm()) this.resetForm();
    else this.mostrarForm.set(true);
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.error.set('');
    const form = this.form();
    const data: Partial<Mascota> = {
      ...form,
      peso: form.peso ? parseFloat(form.peso) : null,
      fechaNacimiento: form.fechaNacimiento || null,
    };
    const id = this.editandoId();
    const req = id ? this.mascotaService.actualizarMia(id, data) : this.mascotaService.crear(data);
    req.subscribe({
      next: () => {
        this.resetForm();
        this.cargarMascotas();
      },
      error: (err) => this.error.set(err.message),
    });
  }

  handleEditar(m: Mascota): void {
    this.form.set({
      nombre: m.nombre,
      especie: m.especie,
      raza: m.raza || '',
      sexo: m.sexo || '',
      peso: m.peso ? String(m.peso) : '',
      fechaNacimiento: m.fechaNacimiento || '',
    });
    this.editandoId.set(m.idMascota);
    this.mostrarForm.set(true);
  }

  handleEliminar(id: number): void {
    if (!confirm('¿Eliminar esta mascota?')) return;
    this.mascotaService.eliminarMia(id).subscribe({
      next: () => this.cargarMascotas(),
      error: (err) => this.error.set(err.message),
    });
  }
}
