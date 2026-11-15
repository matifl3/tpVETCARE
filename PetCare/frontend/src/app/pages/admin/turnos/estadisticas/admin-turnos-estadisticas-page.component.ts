import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadisticasTurnos } from '../../../../core/models';
import { TurnoService } from '../../../../services/turno.service';
import { AGRUPACIONES, PRESETS, Preset, RangoFechas } from './estadisticas.model';
import { PeriodoFiltrosComponent } from './components/periodo-filtros/periodo-filtros.component';
import { KpiGridComponent } from './components/kpi-grid/kpi-grid.component';
import { GraficoBarrasComponent } from './components/grafico-barras/grafico-barras.component';
import { RankingServiciosComponent } from './components/ranking-servicios/ranking-servicios.component';
import { MensajeAlertaComponent } from '../../../../shared/mensaje-alerta/mensaje-alerta.component';

/**
 * Panel de estadísticas de turnos (solo ADMIN).
 * Maneja los filtros, el rango de fechas y la consulta al backend; los
 * bloques visuales (filtros, KPIs, gráficos) son componentes aparte.
 */
@Component({
  selector: 'app-admin-turnos-estadisticas-page',
  imports: [
    RouterLink,
    PeriodoFiltrosComponent,
    KpiGridComponent,
    GraficoBarrasComponent,
    RankingServiciosComponent,
    MensajeAlertaComponent
],
  templateUrl: './admin-turnos-estadisticas-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin-turnos-estadisticas-page.component.css',
})
export class AdminTurnosEstadisticasPageComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);

  readonly presets = PRESETS;
  readonly agrupaciones = AGRUPACIONES;

  readonly preset = signal('anio');
  readonly agrupacion = signal('MES');
  readonly desdeCustom = signal('');
  readonly hastaCustom = signal('');

  readonly data = signal<EstadisticasTurnos | null>(null);
  readonly loading = signal(true);
  readonly refreshing = signal(false);
  readonly error = signal('');
  readonly actualizadoEn = signal('');

  readonly rangoInvalido = computed(() => {
    if (this.preset() !== 'custom') return false;
    const rango = this.calcularRango();
    return !rango || rango.desde > rango.hasta;
  });

  readonly hayDatos = computed(() => (this.data()?.resumen.total ?? 0) > 0);

  readonly etiquetaPreset = computed(
    () => this.presets.find((p) => p.id === this.preset())?.label ?? '',
  );

  ngOnInit(): void {
    this.cargar();
  }

  // ==================== FILTROS ====================

  elegirPreset(preset: Preset): void {
    this.preset.set(preset.id);
    if (preset.agrupacion) this.agrupacion.set(preset.agrupacion);
    this.cargar();
  }

  cambiarAgrupacion(id: string): void {
    this.agrupacion.set(id);
    this.cargar();
  }

  cambiarFecha(cambio: { cual: 'desde' | 'hasta'; valor: string }): void {
    if (cambio.cual === 'desde') this.desdeCustom.set(cambio.valor);
    else this.hastaCustom.set(cambio.valor);
    this.cargar();
  }

  // ==================== CONSULTA ====================

  cargar(): void {
    const rango = this.calcularRango();
    this.error.set('');

    if (!rango) {
      // Todavía faltan fechas del rango personalizado: no se consulta nada.
      this.loading.set(false);
      this.refreshing.set(false);
      return;
    }

    if (rango.desde > rango.hasta) {
      this.error.set('La fecha "desde" no puede ser posterior a la fecha "hasta".');
      this.loading.set(false);
      this.refreshing.set(false);
      return;
    }

    const primeraCarga = this.data() === null;
    this.loading.set(primeraCarga);
    this.refreshing.set(!primeraCarga);

    this.turnoService.estadisticas(rango.desde, rango.hasta, this.agrupacion()).subscribe({
      next: (res) => {
        this.data.set(res);
        this.actualizadoEn.set(new Date().toLocaleTimeString('es-AR'));
        this.loading.set(false);
        this.refreshing.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
        this.refreshing.set(false);
      },
    });
  }

  // ==================== FECHAS ====================

  private calcularRango(): RangoFechas | null {
    const hoy = new Date();
    const hasta = this.aISO(hoy);

    switch (this.preset()) {
      case '30d': {
        const desde = new Date(hoy);
        desde.setDate(desde.getDate() - 29);
        return { desde: this.aISO(desde), hasta };
      }
      case '6m': {
        const desde = new Date(hoy);
        desde.setMonth(desde.getMonth() - 6);
        return { desde: this.aISO(desde), hasta };
      }
      case '12m': {
        const desde = new Date(hoy);
        desde.setMonth(desde.getMonth() - 12);
        return { desde: this.aISO(desde), hasta };
      }
      case 'prox30d': {
        const hastaProx30d = new Date(hoy);
        hastaProx30d.setDate(hastaProx30d.getDate() + 30);
        return { desde: this.aISO(hoy), hasta: this.aISO(hastaProx30d) };
      }
      case 'prox12m': {
        const hastaProx12m = new Date(hoy);
        hastaProx12m.setMonth(hastaProx12m.getMonth() + 12);
        return { desde: this.aISO(hoy), hasta: this.aISO(hastaProx12m) };
      }
      case 'anio':
        return { desde: `${hoy.getFullYear()}-01-01`, hasta: `${hoy.getFullYear()}-12-31` };
      case 'custom': {
        const desde = this.desdeCustom();
        const hastaCustom = this.hastaCustom();
        if (!desde || !hastaCustom) return null;
        return { desde, hasta: hastaCustom };
      }
      default:
        return null;
    }
  }

  /** Formatea una fecha local como YYYY-MM-DD sin pasar por UTC (evita correr un día). */
  private aISO(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
}
