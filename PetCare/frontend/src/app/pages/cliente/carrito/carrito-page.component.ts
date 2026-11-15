import { Component, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Carrito, Tarjeta } from '../../../core/models';
import { CarritoService } from '../../../services/carrito.service';
import { TarjetaService } from '../../../services/tarjeta.service';

import { TarjetaFormComponent, crearFormTarjeta } from '../../../shared/tarjeta-form/tarjeta-form.component';

type Pestana = 'carrito' | 'historial';

@Component({
    selector: 'app-carrito-page',
    imports: [RouterLink, TarjetaFormComponent],
    templateUrl: './carrito-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './carrito-page.component.css'
})
export class CarritoPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly carritoService = inject(CarritoService);
  private readonly tarjetaService = inject(TarjetaService);

  private readonly fb = inject(NonNullableFormBuilder);

  readonly carrito = signal<Carrito | null>(null);
  readonly historial = signal<Carrito[]>([]);
  readonly tarjetas = signal<Tarjeta[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly pestana = signal<Pestana>('carrito');
  readonly comprando = signal(false);

  readonly metodoPago = signal('TARJETA');
  readonly idTarjetaGuardada = signal<number | ''>('');
  readonly mostrarNuevaTarjeta = signal(false);
 
readonly tarjetaNueva = crearFormTarjeta(this.fb);

  readonly hayItems = computed(() => {
    const c = this.carrito();
    return !!c && ((c.items?.length ?? 0) > 0 || (c.turnos?.length ?? 0) > 0);
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading.set(true);
    forkJoin([this.carritoService.obtener(), this.carritoService.historial(), this.tarjetaService.listar()]).subscribe({
      next: ([cart, hist, cards]) => {
        this.carrito.set(cart);
        this.historial.set(hist);
        this.tarjetas.set(cards);
        if (cards.length > 0) this.idTarjetaGuardada.set(cards[0].idTarjeta);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  handleModificar(idProducto: number, cantidad: number): void {
    this.carritoService.modificar(idProducto, cantidad).subscribe({
      next: (nuevo) => this.carrito.set(nuevo),
      error: (err) => this.error.set(err.message),
    });
  }

  handleEliminar(idProducto: number): void {
    this.carritoService.eliminar(idProducto).subscribe({
      next: (nuevo) => this.carrito.set(nuevo),
      error: (err) => this.error.set(err.message),
    });
  }

  handleEliminarTurno(id: number): void {
    this.carritoService.eliminarTurno(id).subscribe({
      next: (c) => this.carrito.set(c),
      error: (err) => this.error.set(err.message),
    });
  }

  seleccionarTarjeta(id: number): void {
    this.idTarjetaGuardada.set(id);
    this.mostrarNuevaTarjeta.set(false);
  }

  toggleNuevaTarjeta(): void {
    this.mostrarNuevaTarjeta.update((v) => !v);
    this.idTarjetaGuardada.set('');
    this.tarjetaNueva.reset();
  }

  handleComprar(): void {

    const idTarjeta = this.idTarjetaGuardada();
    const usaTarjetaNueva = !idTarjeta && this.mostrarNuevaTarjeta();
    
    // Si paga con una tarjeta nueva, primero tiene que estar bien cargada.
    if (usaTarjetaNueva && this.tarjetaNueva.invalid) {
      this.tarjetaNueva.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.success.set('');
    this.comprando.set(true);
    const body: Record<string, unknown> = { metodoPago: 'TARJETA' };
    
    if (idTarjeta) {
      body['idTarjetaGuardada'] = Number(idTarjeta);
    } else if (usaTarjetaNueva) {
      body['tarjetaNueva'] = this.tarjetaNueva.getRawValue();
    }
    this.carritoService.comprar(body).subscribe({
      next: (resultado) => {
        this.comprando.set(false);
        this.success.set('Compra realizada con éxito');
        this.carrito.set(resultado);
        this.cargarDatos();
        setTimeout(
          () => this.router.navigate(['/dashboard/compra-exitosa'], { state: { carrito: resultado } }),
          1000,
        );
      },
      error: (err) => {
        this.error.set(err.message);
        this.comprando.set(false);
      },
    });
  }
}
