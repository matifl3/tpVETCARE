import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ResumenTurnos } from '../../../../../../core/models';

/** Tarjetas con los totales del período consultado. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-kpi-grid',
  templateUrl: './kpi-grid.component.html',
  styleUrl: './kpi-grid.component.css',
})
export class KpiGridComponent {
  readonly resumen = input.required<ResumenTurnos>();
  readonly etiquetaPreset = input('');
}
