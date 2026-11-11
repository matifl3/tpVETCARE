import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Turno } from '../../../core/models';
import { TurnoService } from '../../../services/turno.service';

@Component({
    selector: 'app-mis-turnos-page',
    imports: [RouterLink],
    templateUrl: './mis-turnos-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './mis-turnos-page.component.css'
})
export class MisTurnosPageComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);

  readonly turnos = signal<Turno[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.turnoService.misTurnos().subscribe({
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
}
