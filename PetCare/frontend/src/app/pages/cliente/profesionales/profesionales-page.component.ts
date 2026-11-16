import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profesional, ROLES_PROFESIONALES, capitalizar } from '../../../core/models';
import { ProfesionalService } from '../../../services/profesional.service';
import { MensajeAlertaComponent } from '../../../shared/mensaje-alerta/mensaje-alerta.component';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-profesionales-page',
    imports: [RouterLink, MensajeAlertaComponent],
    templateUrl: './profesionales-page.component.html',
    styleUrl: './profesionales-page.component.css'
})
export class ProfesionalesPageComponent implements OnInit {
  private readonly profesionalService = inject(ProfesionalService);

  protected readonly roles = ROLES_PROFESIONALES;

  readonly profesionales = signal<Profesional[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly filtroRol = signal('');

  protected readonly capitalizar = capitalizar;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(rol?: string): void {
    this.loading.set(true);
    const req = rol ? this.profesionalService.porRol(rol) : this.profesionalService.listar();
    req.subscribe({
      next: (data) => {
        this.profesionales.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  handleFiltrar(rol: string): void {
    this.filtroRol.set(rol);
    this.cargar(rol);
  }
}
