import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Mascota } from '../../../../core/models';

/** La fecha de nacimiento no puede ser posterior a hoy. */
function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const hoy = new Date().toLocaleDateString('en-CA');
  return control.value > hoy ? { fechaFutura: true } : null;
}

@Component({
  selector: 'app-mascota-form',
  imports: [ReactiveFormsModule],
  templateUrl: './mascota-form.component.html',
  styleUrl: './mascota-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MascotaFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly mascotaEditar = input<Mascota | null>(null);
  readonly guardando = input(false);

  readonly guardar = output<{ id: number | null; data: Partial<Mascota> }>();

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    especie: ['', Validators.required],
    raza: ['', Validators.required],
    sexo: ['', Validators.required],
    peso: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.1)]),
    fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
  });

  constructor() {
    effect(() => {
      const m = this.mascotaEditar();
      if (m) {
        this.form.patchValue({
          nombre: m.nombre,
          especie: m.especie,
          raza: m.raza || '',
          sexo: m.sexo || '',
          peso: m.peso ?? null,
          fechaNacimiento: m.fechaNacimiento || '',
        });
      } else {
        this.form.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const data: Partial<Mascota> = {
      ...valores,
      fechaNacimiento: valores.fechaNacimiento || null,
    };

    this.guardar.emit({
      id: this.mascotaEditar()?.idMascota ?? null,
      data,
    });
  }
}