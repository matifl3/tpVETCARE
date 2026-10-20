import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { inputValue } from '../core/form.helpers';
import { ReporteService } from '../services/reporte.service';

type TipoReporte = 'ganancias' | 'ventas' | 'productos';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-admin-reportes-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <div class="admin-header">
        <h1>Reportes</h1>
        <a routerLink="/dashboard" class="btn-secondary" style="padding: 8px 20px; font-size: 13px">← Volver al Dashboard</a>
      </div>
      @if (error()) {
        <div class="alert alert-error show">{{ error() }}</div>
      }

      <div class="admin-card" style="margin-bottom: 24px">
        <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap">
          <button class="tab-btn" [class.active]="tipo() === 'ganancias'" (click)="tipo.set('ganancias')">Ganancias</button>
          <button class="tab-btn" [class.active]="tipo() === 'ventas'" (click)="tipo.set('ventas')">Ventas</button>
          <button class="tab-btn" [class.active]="tipo() === 'productos'" (click)="tipo.set('productos')">Productos más vendidos</button>
        </div>

        <div style="display: flex; gap: 12px; align-items: end; flex-wrap: wrap">
          @if (tipo() === 'ganancias' || tipo() === 'productos') {
            <div class="input-group" style="margin-bottom: 0">
              <label>Año</label>
              <input type="number" [value]="anio()" (input)="anio.set(Number(inputValue($event)))" style="width: 100px" />
            </div>
            <div class="input-group" style="margin-bottom: 0">
              <label>Mes</label>
              <select
                (change)="mes.set(Number(inputValue($event)))"
                style="padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; font-family: inherit; background: white"
              >
                @for (m of meses; track $index) {
                  <option [value]="$index + 1" [selected]="mes() === $index + 1">{{ m }}</option>
                }
              </select>
            </div>
          }
          @if (tipo() === 'ventas') {
            <div class="input-group" style="margin-bottom: 0">
              <label>Fecha inicio</label>
              <input type="date" [value]="fechaInicio()" (input)="fechaInicio.set(inputValue($event))" />
            </div>
            <div class="input-group" style="margin-bottom: 0">
              <label>Fecha fin</label>
              <input type="date" [value]="fechaFin()" (input)="fechaFin.set(inputValue($event))" />
            </div>
          }
          <button class="btn-primary" (click)="consultar()" [disabled]="loading()">
            {{ loading() ? 'Consultando...' : 'Consultar' }}
          </button>
        </div>
      </div>

      @if (data(); as data) {
        <div class="admin-card">
          @if (tipo() === 'ganancias') {
            <div>
              <h3 style="margin-bottom: 16px">Ganancias — {{ meses[mes() - 1] }} {{ anio() }}</h3>
              <p style="margin-bottom: 8px"><strong>Cantidad de ventas:</strong> {{ data.cantidadVentas || 0 }}</p>
              <p style="font-size: 28px; font-weight: 700; color: #667eea">\${{ (data.gananciaTotal || 0).toFixed(2) }}</p>
            </div>
          }
          @if (tipo() === 'ventas') {
            <div>
              <h3 style="margin-bottom: 16px">Ventas del {{ fechaInicio() }} al {{ fechaFin() }}</h3>
              @if (isArray(data) && data.length === 0) {
                <p style="color: #777; padding: 16px; text-align: center">No hay ventas en ese período.</p>
              }
              @if (isArray(data) && data.length > 0) {
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Usuario</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (c of data; track c.id) {
                      <tr>
                        <td>{{ c.id }}</td>
                        <td>{{ c.idUsuario || '—' }}</td>
                        <td>\${{ c.total?.toFixed(2) }}</td>
                        <td>{{ c.estado }}</td>
                        <td>{{ c.fechaCreacion }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          }
          @if (tipo() === 'productos') {
            <div>
              <h3 style="margin-bottom: 16px">Productos más vendidos — {{ meses[mes() - 1] }} {{ anio() }}</h3>
              @if (isArray(data) && data.length === 0) {
                <p style="color: #777; padding: 16px; text-align: center">No hay datos para ese período.</p>
              }
              @if (isArray(data) && data.length > 0) {
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Cantidad vendida</th>
                      <th>Ganancia</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (p of data; track $index) {
                      <tr>
                        <td>{{ p.nombreProducto }}</td>
                        <td>{{ p.categoria }}</td>
                        <td>{{ p.cantidadVendida || 0 }}</td>
                        <td>\${{ (p.gananciaTotal || 0).toFixed(2) }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AdminReportesPageComponent {
  private readonly reporteService = inject(ReporteService);

  protected readonly inputValue = inputValue;
  protected readonly Number = Number;
  protected readonly isArray = Array.isArray;
  protected readonly meses = MESES;

  readonly tipo = signal<TipoReporte>('ganancias');
  readonly anio = signal(new Date().getFullYear());
  readonly mes = signal(new Date().getMonth() + 1);
  readonly fechaInicio = signal('');
  readonly fechaFin = signal('');
  /** Forma libre según el tipo de reporte (objeto o lista), igual que en el JSX. */
  readonly data = signal<any>(null);
  readonly error = signal('');
  readonly loading = signal(false);

  consultar(): void {
    this.error.set('');
    this.loading.set(true);
    this.data.set(null);
    let req: Observable<any>;
    if (this.tipo() === 'ganancias') {
      req = this.reporteService.ganancias(this.anio(), this.mes());
    } else if (this.tipo() === 'ventas') {
      req = this.reporteService.ventas(this.fechaInicio(), this.fechaFin());
    } else {
      req = this.reporteService.productosMasVendidos(this.anio(), this.mes());
    }
    req.subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
