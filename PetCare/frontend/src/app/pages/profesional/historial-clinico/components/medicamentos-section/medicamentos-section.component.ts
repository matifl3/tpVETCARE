import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormField, form, required, validate } from '@angular/forms/signals';
import { Medicamento } from '../../../../../core/models';
import { HistorialClinicoService } from '../../../../../services/historial-clinico.service';
import { fechaHoy, MEDICAMENTO_VACIO, MedicamentoForm } from '../../historial-clinico.model';

/**
 * Sección de medicamentos del historial clínico: listado + alta/edición/baja.
 * Recibe los medicamentos ya cargados por la página y avisa cuando hay que
 * recargar el historial.
 */
@Component({
  selector: 'app-medicamentos-section',
  imports: [FormField],
  templateUrl: './medicamentos-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './medicamentos-section.component.css',
})
export class MedicamentosSectionComponent {
  private readonly historialService = inject(HistorialClinicoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly idMascota = input.required<number>();
  readonly medicamentos = input<Medicamento[]>([]);

  readonly recargar = output<void>();
  readonly exito = output<string>();
  readonly errorMsg = output<string>();

  readonly mostrarForm = signal(false);
  readonly editandoId = signal<number | null>(null);
  readonly medicamentoModel = signal<MedicamentoForm>({ ...MEDICAMENTO_VACIO });
  readonly medicamentoForm = form(this.medicamentoModel, (p) => {
    required(p.nombre, { message: 'El nombre del medicamento es obligatorio' });
    required(p.dosis, { message: 'La dosis es obligatoria' });
    required(p.frecuencia, { message: 'La frecuencia es obligatoria' });
    validate(p.fechaPrescripcion, (ctx) =>
      ctx.value() && ctx.value() > fechaHoy()
        ? { kind: 'fechaFutura', message: 'La fecha de prescripción no puede ser futura' }
        : null,
    );
  });

  nuevo(): void {
    this.editandoId.set(null);
    this.medicamentoModel.set({ ...MEDICAMENTO_VACIO });
    this.medicamentoForm().reset();
    this.mostrarForm.set(true);
  }

  editar(medicamento: Medicamento): void {
    this.editandoId.set(medicamento.id);
    this.medicamentoModel.set({
      nombre: medicamento.nombre ?? '',
      dosis: medicamento.dosis ?? '',
      frecuencia: medicamento.frecuencia ?? '',
      duracion: medicamento.duracion ?? '',
      fechaPrescripcion: medicamento.fechaPrescripcion ?? '',
      indicaciones: medicamento.indicaciones ?? '',
    });
    this.medicamentoForm().reset();
    this.mostrarForm.set(true);
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
    this.medicamentoModel.set({ ...MEDICAMENTO_VACIO });
    this.medicamentoForm().reset();
  }

  guardar(event: Event): void {
    event.preventDefault();

    if (this.medicamentoForm().invalid()) {
      this.medicamentoForm().markAsTouched();
      return;
    }

    const m = this.medicamentoModel();
    const payload = {
      nombre: m.nombre.trim(),
      dosis: m.dosis.trim(),
      frecuencia: m.frecuencia.trim(),
      duracion: m.duracion.trim() || null,
      fechaPrescripcion: m.fechaPrescripcion || null,
      indicaciones: m.indicaciones.trim() || null,
    };
    const id = this.editandoId();
    const request = id
      ? this.historialService.actualizarMedicamento(this.idMascota(), id, payload)
      : this.historialService.registrarMedicamento(this.idMascota(), payload);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.exito.emit(
          id ? 'Medicamento actualizado correctamente' : 'Medicamento registrado correctamente',
        );
        this.cancelar();
        this.recargar.emit();
      },
      error: (err) => this.errorMsg.emit(err.message),
    });
  }

  eliminar(medicamento: Medicamento): void {
    if (!confirm(`¿Eliminar el medicamento "${medicamento.nombre}"?`)) return;
    this.historialService
      .eliminarMedicamento(this.idMascota(), medicamento.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.exito.emit('Medicamento eliminado correctamente');
          if (this.editandoId() === medicamento.id) this.cancelar();
          this.recargar.emit();
        },
        error: (err) => this.errorMsg.emit(err.message),
      });
  }
}
