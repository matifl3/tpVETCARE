import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Mascota } from '../../../core/models';
import { MascotaService } from '../../../services/mascota.service';
import {
  ConfirmacionPendiente,
  ConfirmarModalComponent,
} from '../../../shared/confirmar-modal/confirmar-modal.component';
import { MensajeAlertaComponent } from '../../../shared/mensaje-alerta/mensaje-alerta.component';
import { MascotaCardComponent } from './mascota-card/mascota-card.component';
import { MascotaFormComponent } from './mascota-form/mascota-form.component';

@Component({
  selector: 'app-mascotas-page',
  imports: [
    RouterLink,
    MascotaCardComponent,
    MascotaFormComponent,
    MensajeAlertaComponent,
    ConfirmarModalComponent,
  ],
  templateUrl: './mascotas-page.component.html',
  styleUrl: './mascotas-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MascotasPageComponent implements OnInit {
  private readonly mascotaService = inject(MascotaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly mostrarForm = signal(false);
  readonly mascotaEditar = signal<Mascota | null>(null);
  readonly confirmacion = signal<ConfirmacionPendiente | null>(null);

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.loading.set(true);
    this.mascotaService.misMascotas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.mascotas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  cerrarForm(): void {
    this.mascotaEditar.set(null);
    this.mostrarForm.set(false);
  }

  toggleForm(): void {
    if (this.mostrarForm()) {
      this.cerrarForm();
    } else {
      this.mascotaEditar.set(null);
      this.mostrarForm.set(true);
    }
  }

  onGuardar(evento: { id: number | null; data: Partial<Mascota> }): void {
    this.error.set('');
    this.guardando.set(true);

    const req = evento.id
      ? this.mascotaService.actualizarMia(evento.id, evento.data)
      : this.mascotaService.crear(evento.data);

    req.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarForm();
        this.cargarMascotas();
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err.message);
      },
    });
  }

  handleEditar(m: Mascota): void {
    this.mascotaEditar.set(m);
    this.mostrarForm.set(true);
  }

  handleEliminar(id: number): void {
    this.confirmacion.set({
      titulo: 'Eliminar mascota',
      mensaje: '¿Eliminar esta mascota?',
      textoConfirmar: 'Eliminar',
      accion: () => {
        this.mascotaService.eliminarMia(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => this.cargarMascotas(),
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