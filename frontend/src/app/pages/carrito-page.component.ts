import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { inputValue } from '../core/form.helpers';
import { Carrito, Tarjeta } from '../core/models';
import { CarritoService } from '../services/carrito.service';
import { TarjetaService } from '../services/tarjeta.service';

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
  template: `
    @if (loading()) {
      <div class="dashboard"><p>Cargando...</p></div>
    } @else {
      <div class="dashboard">
        <h1>Carrito</h1>

        @if (error()) {
          <div class="alert alert-error show">{{ error() }}</div>
        }
        @if (success()) {
          <div class="alert alert-success show">{{ success() }}</div>
        }

        <div class="tab-buttons" style="margin-top: 16px">
          <button class="tab-btn" [class.active]="pestana() === 'carrito'" (click)="pestana.set('carrito')">
            Carrito Actual
          </button>
          <button class="tab-btn" [class.active]="pestana() === 'historial'" (click)="pestana.set('historial')">
            Historial
          </button>
        </div>

        @if (pestana() === 'carrito') {
          <div>
            @if (!hayItems()) {
              <p style="color: #777; margin-top: 24px">Tu carrito está vacío.</p>
            } @else {
              @if (carrito(); as carrito) {
              <div style="margin-top: 24px">
                @for (item of carrito.items ?? []; track item.id) {
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #e0e0e0">
                    <div>
                      <strong>{{ item.productoNombre }}</strong>
                      <p style="font-size: 13px; color: #777">\${{ item.precioUnitario.toFixed(2) }} c/u</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <button class="btn-secondary" style="padding: 4px 12px" (click)="handleModificar(item.idProducto, item.cantidad - 1)">−</button>
                      <span>{{ item.cantidad }}</span>
                      <button class="btn-secondary" style="padding: 4px 12px" (click)="handleModificar(item.idProducto, item.cantidad + 1)">+</button>
                      <button
                        class="btn-secondary"
                        style="padding: 4px 12px; color: #d32f2f; border-color: #d32f2f"
                        (click)="handleEliminar(item.idProducto)"
                      >✕</button>
                    </div>
                    <strong>\${{ item.subtotal.toFixed(2) }}</strong>
                  </div>
                }

                @for (t of carrito.turnos ?? []; track t.id) {
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #e0e0e0; background: #f0f0ff">
                    <div>
                      <strong>🗓️ Turno: {{ t.nombreProfesional }}</strong>
                      <p style="font-size: 13px; color: #777">
                        {{ t.nombreMascota }} — {{ t.fecha }} {{ (t.horas ?? 0) > 1 ? '(' + t.horas + ' hs)' : '' }}
                      </p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px">
                      <button
                        class="btn-secondary"
                        style="padding: 4px 12px; color: #d32f2f; border-color: #d32f2f"
                        (click)="handleEliminarTurno(t.id)"
                      >✕</button>
                    </div>
                    <strong>\${{ t.precio?.toFixed(2) }}</strong>
                  </div>
                }

                <div style="text-align: right; margin-top: 24px; padding: 24px; background: #f8f9fa; border-radius: 12px">
                  <h2 style="margin-bottom: 16px">Total: \${{ carrito.total.toFixed(2) }}</h2>

                  <div style="text-align: left; margin-bottom: 16px">
                    <p style="font-weight: 600; margin-bottom: 8px">Método de pago</p>
                    <div style="display: flex; gap: 8px">
                      <label style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 2px solid #667eea; border-radius: 8px; cursor: pointer">
                        <input type="radio" [checked]="metodoPago() === 'TARJETA'" (change)="metodoPago.set('TARJETA')" />
                        💳 Tarjeta
                      </label>
                    </div>
                  </div>

                  @if (metodoPago() === 'TARJETA') {
                    <div style="text-align: left; margin-bottom: 16px">
                      <p style="font-weight: 600; margin-bottom: 8px">Seleccionar tarjeta</p>

                      @if (tarjetas().length > 0) {
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px">
                          @for (t of tarjetas(); track t.idTarjeta) {
                            <label
                              style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; cursor: pointer"
                              [style.border]="'2px solid ' + (idTarjetaGuardada() === t.idTarjeta ? '#667eea' : '#e0e0e0')"
                            >
                              <input
                                type="radio"
                                name="tarjeta"
                                [checked]="idTarjetaGuardada() === t.idTarjeta"
                                (change)="seleccionarTarjeta(t.idTarjeta)"
                              />
                              <span>💳</span>
                              <div>
                                <strong>{{ t.titular }}</strong>
                                <p style="font-size: 13px; color: #777">•••• {{ t.ultimosDigitos }} — Vence: {{ t.vencimiento }}</p>
                              </div>
                            </label>
                          }
                        </div>
                      }

                      <button class="btn-secondary" (click)="toggleNuevaTarjeta()" style="margin-bottom: 12px">
                        {{ mostrarNuevaTarjeta() ? 'Cancelar' : '+ Usar otra tarjeta' }}
                      </button>

                      @if (mostrarNuevaTarjeta()) {
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px; background: white; border-radius: 10px">
                          <div class="input-group">
                            <label>Titular</label>
                            <input [value]="nuevaTarjeta().titular" (input)="updTarjeta({ titular: inputValue($event) })" />
                          </div>
                          <div class="input-group">
                            <label>Número</label>
                            <input
                              [value]="nuevaTarjeta().numeroTarjeta"
                              (input)="updTarjeta({ numeroTarjeta: inputValue($event) })"
                              maxlength="19"
                            />
                          </div>
                          <div class="input-group">
                            <label>Vencimiento (MM/AA)</label>
                            <input
                              [value]="nuevaTarjeta().vencimiento"
                              (input)="updTarjeta({ vencimiento: inputValue($event) })"
                              placeholder="12/28"
                              maxlength="5"
                            />
                          </div>
                          <div class="input-group">
                            <label>CVV</label>
                            <input
                              [value]="nuevaTarjeta().cvv"
                              (input)="updTarjeta({ cvv: inputValue($event) })"
                              placeholder="123"
                              maxlength="4"
                            />
                          </div>
                        </div>
                      }

                      <button
                        class="btn-primary"
                        style="margin-top: 16px; width: 100%"
                        [disabled]="comprando() || (!idTarjetaGuardada() && !mostrarNuevaTarjeta())"
                        (click)="handleComprar()"
                      >
                        {{ comprando() ? 'Procesando...' : 'Pagar $' + carrito.total.toFixed(2) + ' con tarjeta' }}
                      </button>
                    </div>
                  }
                </div>
              </div>
              }
            }
          </div>
        }

        @if (pestana() === 'historial') {
          <div style="margin-top: 24px">
            @if (historial().length === 0) {
              <p style="color: #777">No hay compras anteriores.</p>
            } @else {
              @for (c of historial(); track c.id) {
                <div style="padding: 16px; border-bottom: 1px solid #e0e0e0">
                  <p><strong>Compra #{{ c.id }}</strong> — {{ c.estado }} — \${{ c.total.toFixed(2) }}</p>
                  <p style="font-size: 13px; color: #777">{{ c.fechaCreacion }}</p>
                  @if (c.metodoPago) {
                    <p style="font-size: 13px; color: #777">Método: {{ c.metodoPago }}</p>
                  }
                  @if (c.turnos?.length) {
                    <div style="margin-top: 8px">
                      @for (t of c.turnos; track t.id) {
                        <p style="font-size: 13px; color: #555">🗓️ Turno: {{ t.nombreProfesional }} — {{ t.fecha }}</p>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        }

        <a routerLink="/dashboard" class="btn-secondary" style="margin-top: 24px; display: inline-block">← Volver al Dashboard</a>
      </div>
    }
  `,
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
