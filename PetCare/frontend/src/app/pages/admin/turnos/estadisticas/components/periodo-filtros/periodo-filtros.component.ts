import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { inputValue } from '../../../../../../core/form.helpers';
import { Agrupacion, Preset } from '../../estadisticas.model';

/** Filtros del panel: período (presets o fechas) y agrupación. */
@Component({
  selector: 'app-periodo-filtros',
  templateUrl: './periodo-filtros.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './periodo-filtros.component.css',
})
export class PeriodoFiltrosComponent {
  readonly preset = input.required<string>();
  readonly agrupacion = input.required<string>();
  readonly presets = input.required<Preset[]>();
  readonly agrupaciones = input.required<Agrupacion[]>();
  readonly desde = input('');
  readonly hasta = input('');

  readonly presetElegido = output<Preset>();
  readonly agrupacionCambiada = output<string>();
  readonly fechaCambiada = output<{ cual: 'desde' | 'hasta'; valor: string }>();

  cambiarFecha(cual: 'desde' | 'hasta', event: Event): void {
    this.fechaCambiada.emit({ cual, valor: inputValue(event) });
  }
}
