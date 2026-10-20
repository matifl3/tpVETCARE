import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inputValue } from '../core/form.helpers';
import { Producto } from '../core/models';
import { CarritoService } from '../services/carrito.service';
import { ProductoService } from '../services/producto.service';

const CATEGORIAS = ['ALIMENTO', 'JUGUETE', 'HIGIENE', 'ACCESORIO', 'SALUD', 'ROPA', 'CAMA', 'TRANSPORTE'];

/** Equivalente a frontend/src/pages/TiendaPage.jsx */
@Component({
  selector: 'app-tienda-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <h1>Tienda</h1>
        <p style="margin-bottom: 24px">Productos para tu mascota.</p>

        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }
        @if (success()) {
          <div class="alert alert-success show">{{ success() }}</div>
        }

        <form (submit)="handleBuscar($event)" style="display: flex; gap: 12px; margin-bottom: 24px">
          <input
            type="text"
            placeholder="Buscar producto..."
            [value]="busqueda()"
            (input)="busqueda.set(inputValue($event))"
            style="flex: 1; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; font-family: inherit"
          />
          <button type="submit" class="btn-primary">Buscar</button>
        </form>

        <div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap">
          <button
            [class]="'btn-' + (categoria() === '' && busqueda() === '' ? 'primary' : 'secondary')"
            (click)="filtrarCategoria('')"
          >
            Todas
          </button>
          @for (c of categorias; track c) {
            <button [class]="'btn-' + (categoria() === c ? 'primary' : 'secondary')" (click)="filtrarCategoria(c)">
              {{ c.charAt(0) + c.slice(1).toLowerCase() }}
            </button>
          }
        </div>

        @if (productos().length === 0) {
          <p style="color: #777">No se encontraron productos.</p>
        } @else {
          <div class="card-grid">
            @for (p of productosActivos(); track p.id) {
              <div class="dash-card" style="display: flex; flex-direction: column; justify-content: space-between">
                <div>
                  <span class="dash-icon">📦</span>
                  <h3>{{ p.nombre }}</h3>
                  <p>{{ p.descripcion }}</p>
                  <p style="font-size: 18px; font-weight: 700; color: #667eea; margin-top: 8px">\${{ p.precio.toFixed(2) }}</p>
                  <p style="font-size: 13px" [style.color]="p.stock > 0 ? '#388e3c' : '#d32f2f'">
                    {{ p.stock > 0 ? p.stock + ' en stock' : 'Sin stock' }}
                  </p>
                </div>
                <button
                  class="btn-primary"
                  style="margin-top: 12px; width: 100%"
                  [disabled]="p.stock <= 0"
                  (click)="handleAgregarCarrito(p.id)"
                >
                  {{ p.stock > 0 ? 'Agregar al carrito' : 'Sin stock' }}
                </button>
              </div>
            }
          </div>
        }

        <a routerLink="/dashboard" class="btn-secondary" style="margin-top: 24px; display: inline-block">← Volver al Dashboard</a>
      </div>
    }
  `,
})
export class TiendaPageComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly carritoService = inject(CarritoService);

  protected readonly inputValue = inputValue;
  protected readonly categorias = CATEGORIAS;

  readonly productos = signal<Producto[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly categoria = signal('');
  readonly busqueda = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  productosActivos(): Producto[] {
    return this.productos().filter((p) => p.activo !== false);
  }

  cargar(cat?: string, busq?: string): void {
    this.loading.set(true);
    let req;
    if (busq) {
      req = this.productoService.buscarPorNombre(busq);
    } else if (cat) {
      req = this.productoService.porCategoria(cat);
    } else {
      req = this.productoService.listar();
    }
    req.subscribe({
      next: (data) => {
        this.productos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  handleBuscar(event: Event): void {
    event.preventDefault();
    this.cargar(this.categoria(), this.busqueda());
  }

  filtrarCategoria(cat: string): void {
    this.categoria.set(cat);
    this.busqueda.set('');
    this.cargar(cat, '');
  }

  handleAgregarCarrito(id: number): void {
    this.error.set('');
    this.success.set('');
    this.carritoService.agregar(id, 1).subscribe({
      next: () => {
        this.success.set('Producto agregado al carrito');
        setTimeout(() => this.success.set(''), 2000);
      },
      error: (err) => this.error.set(err.message),
    });
  }
}
