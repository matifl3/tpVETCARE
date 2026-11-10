import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Turno } from '../../../core/models';
import { TurnoService } from '../../../services/turno.service';

@Component({
  selector: 'app-admin-turnos-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-turnos-page.component.html',
  styleUrl: './admin-turnos-page.component.css',
})
export class AdminTurnosPageComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);

  readonly turnos = signal<Turno[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');

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
    if (!confirm('¿Cancelar este turno?')) return;
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
  }
}
