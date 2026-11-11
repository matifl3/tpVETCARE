import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { Turno } from '../../../core/models';
import { TurnoService } from '../../../services/turno.service';

@Component({
    selector: 'app-mis-turnos-profesional-page',
    imports: [RouterLink],
    templateUrl: './mis-turnos-profesional-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './mis-turnos-profesional-page.component.css'
})
export class MisTurnosProfesionalPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly turnoService = inject(TurnoService);

  readonly turnos = signal<Turno[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.turnoService.porProfesional(this.auth.user()!.id).subscribe({
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
