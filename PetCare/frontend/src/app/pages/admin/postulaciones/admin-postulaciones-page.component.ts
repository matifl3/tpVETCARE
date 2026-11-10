import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profesional } from '../../../core/models';
import { ProfesionalService } from '../../../services/profesional.service';

@Component({
  selector: 'app-admin-postulaciones-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-postulaciones-page.component.html',
  styleUrl: './admin-postulaciones-page.component.css',
})
export class AdminPostulacionesPageComponent implements OnInit {
  private readonly profesionalService = inject(ProfesionalService);

  readonly postulaciones = signal<Profesional[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly procesando = signal<number | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.profesionalService.pendientes().subscribe({
      next: (data) => {
        this.postulaciones.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  aprobar(id: number): void {
    this.resolver(id, 'aprobar', 'Profesional aprobado correctamente');
  }

  rechazar(id: number): void {
    this.resolver(id, 'rechazar', 'Profesional rechazado correctamente');
  }

  private resolver(id: number, accion: 'aprobar' | 'rechazar', mensajeDefault: string): void {
    this.error.set('');
    this.success.set('');
    this.procesando.set(id);
    this.profesionalService[accion](id).subscribe({
      next: (res) => {
        this.success.set(res?.['mensaje'] || mensajeDefault);
        this.postulaciones.update((prev) => prev.filter((p) => p.id !== id));
        this.procesando.set(null);
      },
      error: (err) => {
        this.error.set(err.message);
        this.procesando.set(null);
      },
    });
  }
}
