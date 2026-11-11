import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inputValue } from '../../../core/form.helpers';
import { Mascota } from '../../../core/models';
import { MascotaService } from '../../../services/mascota.service';

interface MascotaForm {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  peso: string;
  fechaNacimiento: string;
}

const FORM_VACIO: MascotaForm = {
  nombre: '',
  especie: 'PERRO',
  raza: '',
  sexo: '',
  peso: '',
  fechaNacimiento: '',
};

@Component({
    selector: 'app-mascotas-page',
    imports: [RouterLink],
    templateUrl: './mascotas-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './mascotas-page.component.css'
})
export class MascotasPageComponent implements OnInit {
  private readonly mascotaService = inject(MascotaService);

  protected readonly inputValue = inputValue;

  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly mostrarForm = signal(false);
  readonly editandoId = signal<number | null>(null);
  readonly form = signal<MascotaForm>({ ...FORM_VACIO });

  ngOnInit(): void {
    this.cargarMascotas();
  }

  upd(patch: Partial<MascotaForm>): void {
    this.form.set({ ...this.form(), ...patch });
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

  resetForm(): void {
    this.form.set({ ...FORM_VACIO });
    this.editandoId.set(null);
    this.mostrarForm.set(false);
  }

  toggleForm(): void {
    if (this.mostrarForm()) this.resetForm();
    else this.mostrarForm.set(true);
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.error.set('');
    const form = this.form();
    const data: Partial<Mascota> = {
      ...form,
      peso: form.peso ? parseFloat(form.peso) : null,
      fechaNacimiento: form.fechaNacimiento || null,
    };
    const id = this.editandoId();
    const req = id ? this.mascotaService.actualizarMia(id, data) : this.mascotaService.crear(data);
    req.subscribe({
      next: () => {
        this.resetForm();
        this.cargarMascotas();
      },
      error: (err) => this.error.set(err.message),
    });
  }

  handleEditar(m: Mascota): void {
    this.form.set({
      nombre: m.nombre,
      especie: m.especie,
      raza: m.raza || '',
      sexo: m.sexo || '',
      peso: m.peso ? String(m.peso) : '',
      fechaNacimiento: m.fechaNacimiento || '',
    });
    this.editandoId.set(m.idMascota);
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
