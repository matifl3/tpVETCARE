import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Producto } from '../../../core/models';
import { ProductoService } from '../../../services/producto.service';
import {
  ConfirmacionPendiente,
  ConfirmarModalComponent,
} from '../../../shared/confirmar-modal/confirmar-modal.component';
import { MensajeAlertaComponent } from '../../../shared/mensaje-alerta/mensaje-alerta.component';

@Component({
  selector: 'app-admin-productos-page',
  imports: [RouterLink, ReactiveFormsModule, MensajeAlertaComponent, ConfirmarModalComponent],
  templateUrl: './admin-productos-page.component.html',
  styleUrl: './admin-productos-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductosPageComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly productos = signal<Producto[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly editId = signal<number | null>(null);
  readonly confirmacion = signal<ConfirmacionPendiente | null>(null);

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
    categoria: ['', Validators.required],
    precio: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    // Stock: número entero, 0 o más.
    stock: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]),
    activo: [true],
  });

  ngOnInit(): void {
    this.cargar();
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

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set('');
    const valores = this.form.getRawValue();
    const body: Partial<Producto> = {
      ...valores,
      precio: valores.precio ?? 0,
      stock: valores.stock ?? 0,
    };
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
    this.form.reset();
  }

  editar(p: Producto): void {
    this.editId.set(p.id);
    this.form.patchValue({
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      categoria: p.categoria,
      precio: p.precio,
      stock: p.stock,
      activo: p.activo ?? true,
    });
  }

  eliminar(id: number): void {
    this.confirmacion.set({
      titulo: 'Eliminar producto',
      mensaje: '¿Eliminar producto?',
      textoConfirmar: 'Eliminar',
      accion: () => {
        this.productoService.eliminar(id).subscribe({
          next: () => {
            this.success.set('Producto eliminado');
            this.cargar();
          },
          error: (err) => this.error.set(err.message),
        });
      },
    });
  }

  protected ejecutarConfirmacion(): void {
    const pendiente = this.confirmacion();
    this.confirmacion.set(null);
    pendiente?.accion();
  }
}