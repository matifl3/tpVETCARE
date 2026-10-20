import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inputValue } from '../core/form.helpers';
import { Producto } from '../core/models';
import { ProductoService } from '../services/producto.service';

interface ProductoForm {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: string;
  stock: string;
  activo: boolean;
}

const FORM_VACIO: ProductoForm = { nombre: '', descripcion: '', categoria: '', precio: '', stock: '', activo: true };

@Component({
  selector: 'app-admin-productos-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <div class="admin-header">
          <h1>Productos</h1>
          <a routerLink="/dashboard" class="btn-secondary" style="padding: 8px 20px; font-size: 13px">← Volver al Dashboard</a>
        </div>
        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }
        @if (success()) {
          <div class="alert alert-success show">{{ success() }}</div>
        }

        <form (submit)="handleSubmit($event)" class="admin-card" style="margin-bottom: 24px">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px">
            <div class="input-group" style="margin-bottom: 0">
              <label>Nombre</label>
              <input required [value]="form().nombre" (input)="upd({ nombre: inputValue($event) })" />
            </div>
            <div class="input-group" style="margin-bottom: 0">
              <label>Descripción</label>
              <input required [value]="form().descripcion" (input)="upd({ descripcion: inputValue($event) })" />
            </div>
            <div class="input-group" style="margin-bottom: 0">
              <label>Categoría</label>
              <input required [value]="form().categoria" (input)="upd({ categoria: inputValue($event) })" />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
              <div class="input-group" style="margin-bottom: 0">
                <label>Precio</label>
                <input type="number" step="0.01" required [value]="form().precio" (input)="upd({ precio: inputValue($event) })" />
              </div>
              <div class="input-group" style="margin-bottom: 0">
                <label>Stock</label>
                <input type="number" required [value]="form().stock" (input)="upd({ stock: inputValue($event) })" />
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px">
            <button type="submit" class="btn-primary">
              {{ editId() ? 'Guardar cambios' : 'Crear producto' }}
            </button>
            @if (editId()) {
              <button type="button" class="btn-secondary" (click)="cancelarEdicion()">Cancelar</button>
            }
          </div>
        </form>

        <div class="admin-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Activo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              @for (p of productos(); track p.id) {
                <tr>
                  <td>{{ p.id }}</td>
                  <td>{{ p.nombre }}</td>
                  <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ p.descripcion || '—' }}</td>
                  <td>{{ p.categoria }}</td>
                  <td>\${{ p.precio.toFixed(2) }}</td>
                  <td>{{ p.stock }}</td>
                  <td>{{ p.activo ? '✅' : '❌' }}</td>
                  <td>
                    <div class="actions">
                      <button class="btn-secondary btn-sm" (click)="editar(p)">Editar</button>
                      <button
                        class="btn-secondary btn-sm"
                        style="color: #d32f2f; border-color: #d32f2f"
                        (click)="eliminar(p.id)"
                      >Eliminar</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `,
})
export class AdminProductosPageComponent implements OnInit {
  private readonly productoService = inject(ProductoService);

  protected readonly inputValue = inputValue;

  readonly productos = signal<Producto[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly editId = signal<number | null>(null);
  readonly form = signal<ProductoForm>({ ...FORM_VACIO });

  ngOnInit(): void {
    this.cargar();
  }

  upd(patch: Partial<ProductoForm>): void {
    this.form.set({ ...this.form(), ...patch });
  }

  cargar(): void {
    this.loading.set(true);
    this.productoService.listar().subscribe({
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

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.error.set('');
    const form = this.form();
    const body: Partial<Producto> = { ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock) };
    const id = this.editId();
    const req = id ? this.productoService.actualizar(id, body) : this.productoService.crear(body);
    req.subscribe({
      next: () => {
        this.success.set(id ? 'Producto actualizado' : 'Producto creado');
        this.cancelarEdicion();
        this.cargar();
      },
      error: (err) => this.error.set(err.message),
    });
  }

  cancelarEdicion(): void {
    this.editId.set(null);
    this.form.set({ ...FORM_VACIO });
  }

  editar(p: Producto): void {
    this.editId.set(p.id);
    this.form.set({
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      categoria: p.categoria,
      precio: String(p.precio),
      stock: String(p.stock),
      activo: p.activo ?? true,
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar producto?')) return;
    this.productoService.eliminar(id).subscribe({
      next: () => {
        this.success.set('Producto eliminado');
        this.cargar();
      },
      error: (err) => this.error.set(err.message),
    });
  }
}
