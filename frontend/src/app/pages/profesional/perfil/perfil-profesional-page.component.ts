import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { Profesional } from '../../../core/models';
import { ProfesionalService } from '../../../services/profesional.service';

const ROL_LABELS: Record<string, string> = {
  VETERINARIO: 'Veterinario',
  PASEADOR: 'Paseador',
  PELUQUERO: 'Peluquero',
  ADIESTRADOR: 'Adiestrador',
  CUIDADOR: 'Cuidador',
};

@Component({
  selector: 'app-perfil-profesional-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './perfil-profesional-page.component.html',
  styleUrl: './perfil-profesional-page.component.css',
})
export class PerfilProfesionalPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly profesionalService = inject(ProfesionalService);

  protected readonly rolLabels = ROL_LABELS;

  readonly perfil = signal<Profesional | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.profesionalService.buscarPorId(this.auth.user()!.id).subscribe({
      next: (data) => {
        this.perfil.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
