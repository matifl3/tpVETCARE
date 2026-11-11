import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inputValue } from '../../../core/form.helpers';
import { Producto } from '../../../core/models';
import { ProductoService } from '../../../services/producto.service';

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
    imports: [RouterLink],
    templateUrl: './admin-productos-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './admin-productos-page.component.css'
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
