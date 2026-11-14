import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Carrito, Tarjeta } from '../../../core/models';
import { despuesDe } from '../../../core/tiempo.helpers';
import { CarritoService } from '../../../services/carrito.service';
import { TarjetaService } from '../../../services/tarjeta.service';
import {
  PATRON_CVV,
  PATRON_NUMERO_TARJETA,
  PATRON_VENCIMIENTO,
  tarjetaNoVencida,
} from '../../../core/tarjeta.validators';

type Pestana = 'carrito' | 'historial';

@Component({
    selector: 'app-carrito-page',
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './carrito-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './carrito-page.component.css'
})
export class CarritoPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly carritoService = inject(CarritoService);
  private readonly tarjetaService = inject(TarjetaService);

  protected readonly fb = inject(NonNullableFormBuilder);

  readonly carrito = signal<Carrito | null>(null);
  readonly historial = signal<Carrito[]>([]);
  readonly tarjetas = signal<Tarjeta[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly pestana = signal<Pestana>('carrito');
  readonly comprando = signal(false);

  readonly idTarjetaGuardada = signal<number | ''>('');
  readonly mostrarNuevaTarjeta = signal(false);
  /** Formulario de "Usar otra tarjeta": mismas reglas que Métodos de Pago. */
  readonly tarjetaNueva = this.fb.group({
    titular: ['', [Validators.required, Validators.maxLength(60)]],
    numeroTarjeta: ['', [Validators.required, Validators.pattern(PATRON_NUMERO_TARJETA)]],
    vencimiento: ['', [Validators.required, Validators.pattern(PATRON_VENCIMIENTO), tarjetaNoVencida]],
    cvv: ['', [Validators.required, Validators.pattern(PATRON_CVV)]],
  });

  readonly hayItems = computed(() => {
    const c = this.carrito();
    return !!c && ((c.items?.length ?? 0) > 0 || (c.turnos?.length ?? 0) > 0);
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading.set(true);
    forkJoin([this.carritoService.obtener(), this.carritoService.historial(), this.tarjetaService.listar()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
    this.carritoService
      .modificar(idProducto, cantidad)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (nuevo) => this.carrito.set(nuevo),
        error: (err) => this.error.set(err.message),
      });
  }

  handleEliminar(idProducto: number): void {
    this.carritoService
      .eliminar(idProducto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (nuevo) => this.carrito.set(nuevo),
        error: (err) => this.error.set(err.message),
      });
  }

  handleEliminarTurno(id: number): void {
    this.carritoService
      .eliminarTurno(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
    this.carritoService
      .comprar(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultado) => {
          this.comprando.set(false);
          this.success.set('Compra realizada con éxito');
          this.carrito.set(resultado);
          this.cargarDatos();
          despuesDe(1000, this.destroyRef).subscribe(() =>
            this.router.navigate(['/dashboard/compra-exitosa'], { state: { carrito: resultado } }),
          );
        },
        error: (err) => {
          this.error.set(err.message);
          this.comprando.set(false);
        },
      });
  }
}
