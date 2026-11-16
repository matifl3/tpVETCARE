import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CarritoItemsComponent } from '../carrito-items/carrito-items.component';
import { CarritoPagoComponent } from '../carrito-pago/carrito-pago.component';
import { CarritoHistorialComponent } from '../carrito-historial/carrito-historial.component';
import { CarritoService } from '../../../../services/carrito.service';
import { TarjetaService } from '../../../../services/tarjeta.service';
import { Carrito, Tarjeta } from '../../../../core/models';
import { MensajeAlertaComponent } from '../../../../shared/mensaje-alerta/mensaje-alerta.component';

type Pestana = 'carrito' | 'historial';

@Component({
  selector: 'app-carrito-page',
  imports: [RouterLink, CarritoItemsComponent, CarritoPagoComponent, CarritoHistorialComponent, MensajeAlertaComponent],
  templateUrl: './carrito-page.component.html',
  styleUrl: './carrito-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarritoPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute); 
  private readonly carritoService = inject(CarritoService);
  private readonly tarjetaService = inject(TarjetaService);

  readonly carrito = signal<Carrito | null>(null);
  readonly historial = signal<Carrito[]>([]);
  readonly tarjetas = signal<Tarjeta[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly pestana = signal<Pestana>('carrito');
  readonly comprando = signal(false);

  readonly hayItems = computed(() => {
    const c = this.carrito();
    return !!c && ((c.items?.length ?? 0) > 0 || (c.turnos?.length ?? 0) > 0);
  });

  ngOnInit(): void {
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam === 'historial') {
      this.pestana.set('historial');
    }
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading.set(true);
    forkJoin([
      this.carritoService.obtener(),
      this.carritoService.historial(),
      this.tarjetaService.listar(),
    ]).subscribe({
      next: ([cart, hist, cards]) => {
        this.carrito.set(cart);
        this.historial.set(hist);
        this.tarjetas.set(cards);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  handleModificar(evento: { idProducto: number; cantidad: number }): void {
    this.carritoService.modificar(evento.idProducto, evento.cantidad).subscribe({
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

  handleComprar(body: Record<string, unknown>): void {
    this.error.set('');
    this.success.set('');
    this.comprando.set(true);

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