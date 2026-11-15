import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Mascota } from '../../../core/models';
import { MascotaService } from '../../../services/mascota.service';
import { MascotaCardComponent } from './mascota-card/mascota-card.component';
import { MascotaFormComponent } from './mascota-form/mascota-form.component';

@Component({
  selector: 'app-mascotas-page',
  imports: [RouterLink, MascotaCardComponent, MascotaFormComponent],
  templateUrl: './mascotas-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './mascotas-page.component.css',
})
export class MascotasPageComponent implements OnInit {
  private readonly mascotaService = inject(MascotaService);

  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly mostrarForm = signal(false);
  readonly mascotaEditar = signal<Mascota | null>(null);

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.loading.set(true);
    this.mascotaService.misMascotas().subscribe({
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

  cerrarForm(): void {
    this.mascotaEditar.set(null);
    this.mostrarForm.set(false);
  }

  toggleForm(): void {
    if (this.mostrarForm()) {
      this.cerrarForm();
    } else {
      this.mascotaEditar.set(null);
      this.mostrarForm.set(true);
    }
  }

  onGuardar(evento: { id: number | null; data: Partial<Mascota> }): void {
    this.error.set('');
    this.guardando.set(true);

    const req = evento.id
      ? this.mascotaService.actualizarMia(evento.id, evento.data)
      : this.mascotaService.crear(evento.data);

    req.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarForm();
        this.cargarMascotas();
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err.message);
      },
    });
  }

  handleEditar(m: Mascota): void {
    this.mascotaEditar.set(m);
    this.mostrarForm.set(true);
  }

  handleEliminar(id: number): void {
    if (!confirm('¿Eliminar esta mascota?')) return;
    this.mascotaService.eliminarMia(id).subscribe({
      next: () => this.cargarMascotas(),
      error: (err) => this.error.set(err.message),
    });
  }
}