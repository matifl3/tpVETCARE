import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profesional } from '../../../core/models';
import { ProfesionalService } from '../../../services/profesional.service';

const ROLES = ['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR'];

@Component({
  selector: 'app-profesionales-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profesionales-page.component.html',
  styleUrl: './profesionales-page.component.css',
})
export class ProfesionalesPageComponent implements OnInit {
  private readonly profesionalService = inject(ProfesionalService);

  protected readonly roles = ROLES;

  readonly profesionales = signal<Profesional[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly filtroRol = signal('');

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

  capitalizar(r: string | undefined): string {
    return r ? r.charAt(0) + r.slice(1).toLowerCase() : '';
  }
}
