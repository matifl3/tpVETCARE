import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmacionPendiente, Turno } from '../../../core/models';
import { TurnoService } from '../../../services/turno.service';
import { ConfirmarModalComponent } from '../../../shared/confirmar-modal/confirmar-modal.component';
import { MensajeAlertaComponent } from '../../../shared/mensaje-alerta/mensaje-alerta.component';

@Component({
  selector: 'app-admin-turnos-page',
  imports: [RouterLink, MensajeAlertaComponent, ConfirmarModalComponent],
  templateUrl: './admin-turnos-page.component.html',
  styleUrl: './admin-turnos-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTurnosPageComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);

  readonly turnos = signal<Turno[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly confirmacion = signal<ConfirmacionPendiente | null>(null);

  ngOnInit(): void {
    this.turnoService.listarTodos().subscribe({
      next: (data) => {
        this.turnos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  handleCancelar(id: number): void {
    this.confirmacion.set({
      titulo: 'Cancelar turno',
      mensaje: '¿Cancelar este turno?',
      textoConfirmar: 'Cancelar turno',
      accion: () => {
        this.error.set('');
        this.success.set('');
        this.turnoService.cancelar(id).subscribe({
          next: () => {
            this.success.set('Turno cancelado correctamente');
            this.turnos.update((prev) =>
              prev.map((t) => (t.id === id ? { ...t, estadoTurno: 'CANCELADO', activo: false } : t)),
            );
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