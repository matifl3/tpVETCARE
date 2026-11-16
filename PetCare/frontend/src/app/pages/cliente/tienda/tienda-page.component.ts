import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIAS_PRODUCTO, Producto, EstadoTarjeta } from '../../../core/models';
import { CarritoService } from '../../../services/carrito.service';
import { ProductoService } from '../../../services/producto.service';
import { MensajeAlertaComponent } from '../../../shared/mensaje-alerta/mensaje-alerta.component';
import is from '@angular/common/locales/extra/is';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-tienda-page',
    imports: [RouterLink, MensajeAlertaComponent, ReactiveFormsModule],
    templateUrl: './tienda-page.component.html',
    styleUrl: './tienda-page.component.css'
})
export class TiendaPageComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly carritoService = inject(CarritoService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly categorias = CATEGORIAS_PRODUCTO;

  readonly productos = signal<Producto[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly categoria = signal('');

  readonly estadoTarjeta = signal<Record<number, EstadoTarjeta>>({});
  readonly cantidades = signal<Record<number, number>>({});
  readonly ultimaCantidadAgregada = signal<Record<number, number>>({});
  readonly mostrarIrCarrito = signal(false);

  /** Buscador por nombre (opcional, sin validaciones). */
  readonly filtros = this.fb.group({
    busqueda: [''],
  });

  ngOnInit(): void {
    this.cargar('', '', true);
  }

  productosActivos(): Producto[] {
    return this.productos().filter((p) => p.activo !== false);
  }

  cargar(cat?: string, busq?: string, mostrarCarga = false): void {
    if(mostrarCarga) {
      this.loading.set(true);
    }
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

  buscar(): void {
    const texto = this.filtros.controls.busqueda.value.trim();
    this.cargar(this.categoria(), texto);
  }

  filtrarCategoria(cat: string): void {
    this.categoria.set(cat);
    this.filtros.reset();
    this.cargar(cat, '');
  }

  handleAgregarCarrito(id: number): void {
    const cantidad = this.cantidadSeleccionada(id);
    this.error.set('');
    this.success.set('');

    this.carritoService.agregar(id, cantidad).subscribe({
      next: () => {
        this.success.set(cantidad > 1 ? `Se agregaron ${cantidad} unidades al carrito.` : 'Producto agregado al carrito.');
        this.ultimaCantidadAgregada.update((prev) => ({ ...prev, [id]: cantidad }));
        this.estadoTarjeta.update((prev) => ({ ...prev, [id]: 'agregado' }));
      },
      error: (err) => {
        this.error.set(err instanceof Error ? err.message : 'No se pudo agregar al carrito.');
      },
    });
  }

  estadoDe(idProducto: number): EstadoTarjeta {
    return this.estadoTarjeta()[idProducto] ?? 'inicial';
  }

  cantidadSeleccionada(idProducto: number): number {
    return this.cantidades()[idProducto] ?? 1;
  }

  iniciarSeleccion(idProducto: number): void {
    this.cantidades.update((actual) => ({ ...actual, [idProducto]: 1 }));
    this.estadoTarjeta.update((actual) => ({ ...actual, [idProducto]: 'eligiendo' }));
  }

  cancelarSeleccion(idProducto: number): void {
    this.estadoTarjeta.update((actual) => ({ ...actual, [idProducto]: 'inicial' }));
  }

  cambiarCantidad(idProducto: number, nuevaCantidad: number, stockMaximo: number): void {
    const actual = this.cantidadSeleccionada(idProducto);
    const nueva = Math.max(1, Math.min(stockMaximo, actual + nuevaCantidad));
    this.cantidades.update((prev) => ({ ...prev, [idProducto]: nueva }));
  }
}
