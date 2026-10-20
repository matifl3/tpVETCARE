import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inputValue } from '../core/form.helpers';
import { Tarjeta } from '../core/models';
import { TarjetaService } from '../services/tarjeta.service';

interface TarjetaForm {
  titular: string;
  numeroTarjeta: string;
  vencimiento: string;
  cvv: string;
}

const FORM_VACIO: TarjetaForm = { titular: '', numeroTarjeta: '', vencimiento: '', cvv: '' };

@Component({
  selector: 'app-tarjetas-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px">
          <h1>Métodos de Pago</h1>
          <button class="btn-primary" (click)="mostrarForm.set(!mostrarForm())">
            {{ mostrarForm() ? 'Cancelar' : '+ Nueva Tarjeta' }}
          </button>
        </div>

        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }
        @if (success()) {
          <div class="alert alert-success show">{{ success() }}</div>
        }

        @if (mostrarForm()) {
          <form (submit)="handleAgregar($event)" style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin-bottom: 32px">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
              <div class="input-group">
                <label>Titular</label>
                <input required [value]="form().titular" (input)="upd({ titular: inputValue($event) })" />
              </div>
              <div class="input-group">
                <label>Número de tarjeta</label>
                <input
                  required
                  [value]="form().numeroTarjeta"
                  (input)="upd({ numeroTarjeta: inputValue($event) })"
                  placeholder="1234567890123456"
                  maxlength="19"
                />
              </div>
              <div class="input-group">
                <label>Vencimiento (MM/AA)</label>
                <input
                  required
                  [value]="form().vencimiento"
                  (input)="upd({ vencimiento: inputValue($event) })"
                  placeholder="12/28"
                  maxlength="5"
                />
              </div>
              <div class="input-group">
                <label>CVV</label>
                <input
                  required
                  [value]="form().cvv"
                  (input)="upd({ cvv: inputValue($event) })"
                  placeholder="123"
                  maxlength="4"
                />
              </div>
            </div>
            <button type="submit" class="btn-primary" style="margin-top: 16px">Guardar Tarjeta</button>
          </form>
        }

        @if (tarjetas().length === 0) {
          <p style="color: #777">No tenés tarjetas registradas.</p>
        } @else {
          <div class="card-grid">
            @for (t of tarjetas(); track t.idTarjeta) {
              <div class="dash-card" style="position: relative">
                <span class="dash-icon">💳</span>
                <h3>{{ t.titular }}</h3>
                <p>•••• {{ t.ultimosDigitos }}</p>
                <p style="font-size: 13px; color: #777">Vence: {{ t.vencimiento }}</p>
                <button
                  (click)="handleEliminar(t.idTarjeta)"
                  style="position: absolute; top: 8px; right: 8px; background: none; border: none; font-size: 18px; cursor: pointer; color: #d32f2f"
                  title="Eliminar"
                >✕</button>
              </div>
            }
          </div>
        }

        <a routerLink="/dashboard" class="btn-secondary" style="margin-top: 24px; display: inline-block">← Volver al Dashboard</a>
      </div>
    }
  `,
})
export class TarjetasPageComponent implements OnInit {
  private readonly tarjetaService = inject(TarjetaService);

  protected readonly inputValue = inputValue;

  readonly tarjetas = signal<Tarjeta[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly mostrarForm = signal(false);
  readonly form = signal<TarjetaForm>({ ...FORM_VACIO });

  ngOnInit(): void {
    this.cargarTarjetas();
  }

  upd(patch: Partial<TarjetaForm>): void {
    this.form.set({ ...this.form(), ...patch });
  }

  cargarTarjetas(): void {
    this.tarjetaService.listar().subscribe({
      next: (data) => {
        this.tarjetas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  handleAgregar(event: Event): void {
    event.preventDefault();
    this.error.set('');
    this.tarjetaService.agregar({ ...this.form() }).subscribe({
      next: () => {
        this.success.set('Tarjeta agregada correctamente');
        this.mostrarForm.set(false);
        this.form.set({ ...FORM_VACIO });
        this.cargarTarjetas();
        setTimeout(() => this.success.set(''), 3000);
      },
      error: (err) => this.error.set(err.message),
    });
  }

  handleEliminar(id: number): void {
    if (!confirm('¿Eliminar esta tarjeta?')) return;
    this.tarjetaService.eliminar(id).subscribe({
      next: () => this.cargarTarjetas(),
      error: (err) => this.error.set(err.message),
    });
  }
}
