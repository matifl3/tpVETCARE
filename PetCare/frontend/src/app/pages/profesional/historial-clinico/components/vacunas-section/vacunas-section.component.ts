import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormField, form, required, validate } from '@angular/forms/signals';
import { Vacuna } from '../../../../../core/models';
import { HistorialClinicoService } from '../../../../../services/historial-clinico.service';
import { fechaHoy, VACUNA_VACIA, VacunaForm } from '../../historial-clinico.model';

/**
 * Sección de vacunas del historial clínico: listado + alta/edición/baja.
 * Recibe las vacunas ya cargadas por la página y avisa cuando hay que
 * recargar el historial.
 */
@Component({
  selector: 'app-vacunas-section',
  imports: [FormField],
  templateUrl: './vacunas-section.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './vacunas-section.component.css',
})
export class VacunasSectionComponent {
  private readonly historialService = inject(HistorialClinicoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly idMascota = input.required<number>();
  readonly vacunas = input<Vacuna[]>([]);

  readonly recargar = output<void>();
  readonly exito = output<string>();
  readonly errorMsg = output<string>();

  readonly mostrarForm = signal(false);
  readonly editandoId = signal<number | null>(null);
  readonly vacunaModel = signal<VacunaForm>({ ...VACUNA_VACIA });
  readonly vacunaForm = form(this.vacunaModel, (p) => {
    required(p.nombre, { message: 'El nombre de la vacuna es obligatorio' });
    required(p.lote, { message: 'El lote es obligatorio' });
    validate(p.fechaAplicacion, (ctx) =>
      ctx.value() && ctx.value() > fechaHoy()
        ? { kind: 'fechaFutura', message: 'La fecha de aplicación no puede ser futura' }
        : null,
    );
    validate(p.fechaProximaDosis, (ctx) =>
      ctx.value() && ctx.value() <= fechaHoy()
        ? { kind: 'fechaInvalida', message: 'La próxima dosis debe ser una fecha futura' }
        : null,
    );
  });

  nueva(): void {
    this.editandoId.set(null);
    this.vacunaModel.set({ ...VACUNA_VACIA });
    this.vacunaForm().reset();
    this.mostrarForm.set(true);
  }

  editar(vacuna: Vacuna): void {
    this.editandoId.set(vacuna.id);
    this.vacunaModel.set({
      nombre: vacuna.nombre ?? '',
      lote: vacuna.lote ?? '',
      fechaAplicacion: vacuna.fechaAplicacion ?? '',
      fechaProximaDosis: vacuna.fechaProximaDosis ?? '',
      observaciones: vacuna.observaciones ?? '',
    });
    this.vacunaForm().reset();
    this.mostrarForm.set(true);
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
    this.vacunaModel.set({ ...VACUNA_VACIA });
    this.vacunaForm().reset();
  }

  guardar(event: Event): void {
    event.preventDefault();

    if (this.vacunaForm().invalid()) {
      this.vacunaForm().markAsTouched();
      return;
    }

    const v = this.vacunaModel();
    const payload = {
      nombre: v.nombre.trim(),
      lote: v.lote.trim(),
      fechaAplicacion: v.fechaAplicacion || null,
      fechaProximaDosis: v.fechaProximaDosis || null,
      observaciones: v.observaciones.trim() || null,
    };
    const id = this.editandoId();
    const request = id
      ? this.historialService.actualizarVacuna(this.idMascota(), id, payload)
      : this.historialService.registrarVacuna(this.idMascota(), payload);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.exito.emit(id ? 'Vacuna actualizada correctamente' : 'Vacuna registrada correctamente');
        this.cancelar();
        this.recargar.emit();
      },
      error: (err) => this.errorMsg.emit(err.message),
    });
  }

  eliminar(vacuna: Vacuna): void {
    if (!confirm(`¿Eliminar la vacuna "${vacuna.nombre}"?`)) return;
    this.historialService
      .eliminarVacuna(this.idMascota(), vacuna.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.exito.emit('Vacuna eliminada correctamente');
          if (this.editandoId() === vacuna.id) this.cancelar();
          this.recargar.emit();
        },
        error: (err) => this.errorMsg.emit(err.message),
      });
  }
}
