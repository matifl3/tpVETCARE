import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Mascota } from '../../../core/models';
import { MascotaService } from '../../../services/mascota.service';

@Component({
    selector: 'app-admin-mascotas-page',
    imports: [RouterLink],
    templateUrl: './admin-mascotas-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './admin-mascotas-page.component.css'
})
export class AdminMascotasPageComponent implements OnInit {
  private readonly mascotaService = inject(MascotaService);

  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.mascotaService.listarTodos().subscribe({
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
