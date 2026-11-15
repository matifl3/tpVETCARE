import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ServicioRanking } from '../../../../../../core/models';

/** Ranking de servicios más solicitados en el período. */
@Component({
  selector: 'app-ranking-servicios',
  templateUrl: './ranking-servicios.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ranking-servicios.component.css',
})
export class RankingServiciosComponent {
  readonly ranking = input.required<ServicioRanking[]>();

  /** Ancho de la barra en % (mínimo visible para porcentajes chicos). */
  anchoBarra(porcentaje: number): number {
    return Math.max(porcentaje, 2);
  }
}
