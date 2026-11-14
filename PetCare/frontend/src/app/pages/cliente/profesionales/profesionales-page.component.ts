import { Component, DestroyRef, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Profesional } from '../../../core/models';
import { NombreRolPipe } from '../../../core/pipes/nombre-rol.pipe';
import { ProfesionalService } from '../../../services/profesional.service';

const ROLES = ['VETERINARIO', 'PASEADOR', 'PELUQUERO', 'ADIESTRADOR', 'CUIDADOR'];

@Component({
    selector: 'app-profesionales-page',
    imports: [RouterLink, NombreRolPipe],
    templateUrl: './profesionales-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './profesionales-page.component.css'
})
export class ProfesionalesPageComponent implements OnInit {
  private readonly profesionalService = inject(ProfesionalService);
  private readonly destroyRef = inject(DestroyRef);

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
    req.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
