import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GananciaMensual } from '../../../../../core/models';
import { ReporteService } from '../../../../../services/reporte.service';
import { ANIO_ACTUAL, MESES } from '../../resportes.model';
import { MensajeAlertaComponent } from '../../../../../shared/mensaje-alerta/mensaje-alerta.component';

@Component({
  selector: 'app-reporte-ganancias',
  imports: [ReactiveFormsModule, MensajeAlertaComponent],
  templateUrl: './reporte-ganancia.component.html',
  styleUrls: ['./reporte-ganancia.component.css', '../../reportes-filtros.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReporteGananciasComponent {
  private readonly reporteService = inject(ReporteService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly meses = MESES;
  protected readonly anioActual = ANIO_ACTUAL;

  readonly periodoMes = this.fb.group({
    anio: this.fb.control<number | null>(ANIO_ACTUAL, [
      Validators.required,
      Validators.min(2000),
      Validators.max(ANIO_ACTUAL),
    ]),
    mes: [new Date().getMonth() + 1, Validators.required],
  });

  readonly data = signal<GananciaMensual | null>(null);
  readonly error = signal('');
  readonly loading = signal(false);

  consultar(): void {
    if (this.periodoMes.invalid) {
      this.periodoMes.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.loading.set(true);
    this.data.set(null);

    const { anio, mes } = this.periodoMes.getRawValue();
    this.reporteService.ganancias(Number(anio), mes).subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}