import {Component,OnInit,inject,signal,ChangeDetectionStrategy,} from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Mascota } from '../../../core/models';
import { MascotaService } from '../../../services/mascota.service';

/** La fecha de nacimiento no puede ser posterior a hoy. */
function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const hoy = new Date().toLocaleDateString('en-CA');
  return control.value>hoy ? {fechaFutura: true} : null;
}

@Component({
  selector: 'app-mascotas-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './mascotas-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './mascotas-page.component.css',
})
export class MascotasPageComponent implements OnInit {
  private readonly mascotaService = inject(MascotaService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly mascotas = signal<Mascota[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly mostrarForm = signal(false);
  readonly editandoId = signal<number | null>(null);
 readonly form = this.fb.group({
  nombre: ['', [Validators.required, Validators.maxLength(50)]],
  especie: ['', Validators.required],
  raza: ['', Validators.required],
  sexo: ['', Validators.required],
  peso: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.1)]),
  fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
});

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

  resetForm(): void {
    this.form.reset();
    this.editandoId.set(null);
    this.mostrarForm.set(false);
  }

  toggleForm(): void {
    if (this.mostrarForm()) this.resetForm();
    else this.mostrarForm.set(true);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set('');
    const valores = this.form.getRawValue();
    const data: Partial<Mascota> = {
      ...valores,
      fechaNacimiento: valores.fechaNacimiento || null,
    };
    const id = this.editandoId();
    const req = id
      ? this.mascotaService.actualizarMia(id, data)
      : this.mascotaService.crear(data);
    req.subscribe({
      next: () => {
        this.resetForm();
        this.cargarMascotas();
      },
      error: (err) => this.error.set(err.message),
    });
  }

  handleEditar(m: Mascota): void {
    this.form.patchValue({
      nombre: m.nombre,
      especie: m.especie,
      raza: m.raza || '',
      sexo: m.sexo || '',
      peso: m.peso ?? null,
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
