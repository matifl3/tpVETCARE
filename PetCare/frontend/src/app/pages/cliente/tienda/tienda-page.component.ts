import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Producto } from '../../../core/models';
import { CarritoService } from '../../../services/carrito.service';
import { ProductoService } from '../../../services/producto.service';

const CATEGORIAS = ['ALIMENTO', 'JUGUETE', 'HIGIENE', 'ACCESORIO', 'SALUD', 'ROPA', 'CAMA', 'TRANSPORTE'];

@Component({
    selector: 'app-tienda-page',
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './tienda-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './tienda-page.component.css'
})
export class TiendaPageComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly carritoService = inject(CarritoService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly categorias = CATEGORIAS;

  readonly productos = signal<Producto[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly categoria = signal('');

  /** Buscador por nombre (opcional, sin validaciones). */
  readonly filtros = this.fb.group({
    busqueda: [''],
  });

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
