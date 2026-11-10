import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { inputValue } from '../../../core/form.helpers';
import { Carrito, Tarjeta } from '../../../core/models';
import { CarritoService } from '../../../services/carrito.service';
import { TarjetaService } from '../../../services/tarjeta.service';

type Pestana = 'carrito' | 'historial';

interface NuevaTarjetaForm {
  titular: string;
  numeroTarjeta: string;
  vencimiento: string;
  cvv: string;
}

const TARJETA_VACIA: NuevaTarjetaForm = { titular: '', numeroTarjeta: '', vencimiento: '', cvv: '' };

@Component({
  selector: 'app-carrito-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './carrito-page.component.html',
  styleUrl: './carrito-page.component.css',
})
export class CarritoPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly carritoService = inject(CarritoService);
  private readonly tarjetaService = inject(TarjetaService);

  protected readonly inputValue = inputValue;

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
  readonly nuevaTarjeta = signal<NuevaTarjetaForm>({ ...TARJETA_VACIA });

  readonly hayItems = computed(() => {
    const c = this.carrito();
    return !!c && ((c.items?.length ?? 0) > 0 || (c.turnos?.length ?? 0) > 0);
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  updTarjeta(patch: Partial<NuevaTarjetaForm>): void {
    this.nuevaTarjeta.set({ ...this.nuevaTarjeta(), ...patch });
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
  }

  handleComprar(): void {
    this.error.set('');
    this.success.set('');
    this.comprando.set(true);
    const body: Record<string, unknown> = { metodoPago: 'TARJETA' };
    const idTarjeta = this.idTarjetaGuardada();
    if (idTarjeta) {
      body['idTarjetaGuardada'] = Number(idTarjeta);
    } else if (this.mostrarNuevaTarjeta()) {
      body['tarjetaNueva'] = this.nuevaTarjeta();
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
