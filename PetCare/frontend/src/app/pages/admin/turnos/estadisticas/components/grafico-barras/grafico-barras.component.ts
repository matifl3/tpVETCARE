import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TurnoPeriodo } from '../../../../../../core/models';

/** Gráfico de barras de turnos por período (componente puramente presentacional). */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grafico-barras',
  templateUrl: './grafico-barras.component.html',
  styleUrl: './grafico-barras.component.css',
})
export class GraficoBarrasComponent {
  readonly periodos = input.required<TurnoPeriodo[]>();

  readonly maximo = computed(() =>
    Math.max(1, ...this.periodos().map((p) => p.cantidad)),
  );

  /** Altura de la barra en % (mínimo visible para que un turno no sea una línea). */
  altoBarra(cantidad: number): number {
    if (cantidad === 0) return 0;
    return Math.max(4, Math.round((cantidad / this.maximo()) * 100));
  }
}
