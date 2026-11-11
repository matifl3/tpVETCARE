import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { Mascota, SessionUser } from '../../../core/models';
import { MascotaService } from '../../../services/mascota.service';

@Component({
  selector: 'app-mis-pacientes-profesional-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mis-pacientes-profesional-page.component.html',
  styleUrl: './mis-pacientes-profesional-page.component.css',
})
export class MisPacientesProfesionalPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly mascotaService = inject(MascotaService);

  protected readonly user: SessionUser = this.auth.user()!;

  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.mascotaService.atendidasPor(this.user.id).subscribe({
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
}
