import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Agrupacion, Preset } from '../../estadisticas.model';

/** Filtros del panel: período (presets o fechas) y agrupación. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-periodo-filtros',
  templateUrl: './periodo-filtros.component.html',
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

  cambiarFecha(cual: 'desde' | 'hasta', valor: string): void {
    this.fechaCambiada.emit({ cual, valor });
  }
}
