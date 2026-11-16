import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Tarjeta } from '../../../core/models';
import { TarjetaService } from '../../../services/tarjeta.service';
import {
  ConfirmacionPendiente,
  ConfirmarModalComponent,
} from '../../../shared/confirmar-modal/confirmar-modal.component';
import { MensajeAlertaComponent } from '../../../shared/mensaje-alerta/mensaje-alerta.component';
import {
  crearFormTarjeta,
  TarjetaFormComponent,
} from '../../../shared/tarjeta-form/tarjeta-form.component';

@Component({
  selector: 'app-tarjetas-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TarjetaFormComponent,
    MensajeAlertaComponent,
    ConfirmarModalComponent,
  ],
  templateUrl: './tarjetas-page.component.html',
  styleUrls: ['./tarjetas-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetasPageComponent implements OnInit {
  private readonly tarjetaService = inject(TarjetaService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly tarjetas = signal<Tarjeta[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly mostrarForm = signal(false);
  readonly confirmacion = signal<ConfirmacionPendiente | null>(null);

  readonly form = crearFormTarjeta(this.fb);

  ngOnInit(): void {
    this.cargarTarjetas();
  }

  cargarTarjetas(): void {
    this.tarjetaService.listar().subscribe({
      next: (data) => {
        this.tarjetas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  toggleForm(): void {
    this.form.reset();
    this.mostrarForm.update((v) => !v);
  }

  agregar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set('');
    this.tarjetaService.agregar(this.form.getRawValue()).subscribe({
      next: () => {
        this.success.set('Tarjeta agregada correctamente');
        this.mostrarForm.set(false);
        this.form.reset();
        this.cargarTarjetas();
        setTimeout(() => this.success.set(''), 3000);
      },
      error: (err) => this.error.set(err.message),
    });
  }

  handleEliminar(id: number): void {
    this.confirmacion.set({
      titulo: 'Eliminar tarjeta',
      mensaje: '¿Eliminar esta tarjeta?',
      textoConfirmar: 'Eliminar',
      accion: () => {
        this.tarjetaService.eliminar(id).subscribe({
          next: () => this.cargarTarjetas(),
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