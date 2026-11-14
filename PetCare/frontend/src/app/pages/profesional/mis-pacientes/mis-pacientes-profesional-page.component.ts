import { Component, DestroyRef, OnInit, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { Mascota } from '../../../core/models';
import { MascotaService } from '../../../services/mascota.service';

@Component({
    selector: 'app-mis-pacientes-profesional-page',
    imports: [RouterLink],
    templateUrl: './mis-pacientes-profesional-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './mis-pacientes-profesional-page.component.css'
})
export class MisPacientesProfesionalPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly mascotaService = inject(MascotaService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly user = computed(() => this.auth.user()!);

  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.mascotaService
      .atendidasPor(this.user().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
