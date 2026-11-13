import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inputValue } from '../../../../core/form.helpers';
import { EstadisticasTurnos } from '../../../../core/models';
import { TurnoService } from '../../../../services/turno.service';

/** Atajos de período: al elegirlos también se ajusta la agrupación. */
interface Preset {
  id: string;
  label: string;
  agrupacion: string | null;
}

interface Agrupacion {
  id: string;
  label: string;
}

interface RangoFechas {
  desde: string;
  hasta: string;
}

const PRESETS: Preset[] = [
  { id: '30d', label: 'Últimos 30 días', agrupacion: 'DIA' },
  { id: '6m', label: 'Últimos 6 meses', agrupacion: 'SEMANA' },
  { id: '12m', label: 'Últimos 12 meses', agrupacion: 'MES' },
  { id: 'anio', label: 'Este año', agrupacion: 'MES' },
  { id: 'custom', label: 'Personalizado', agrupacion: null },
];

const AGRUPACIONES: Agrupacion[] = [
  { id: 'DIA', label: 'Día' },
  { id: 'SEMANA', label: 'Semana' },
  { id: 'MES', label: 'Mes' },
];

/**
 * Panel de estadísticas de turnos (solo ADMIN).
 * Cada cambio de filtro consulta de nuevo al backend, así el administrador
 * siempre ve el estado actual de la base (sin caché ni polling).
 */
@Component({
  selector: 'app-admin-turnos-estadisticas-page',
  imports: [RouterLink],
  templateUrl: './admin-turnos-estadisticas-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin-turnos-estadisticas-page.component.css',
})
export class AdminTurnosEstadisticasPageComponent implements OnInit {
  private readonly turnoService = inject(TurnoService);

  readonly presets = PRESETS;
  readonly agrupaciones = AGRUPACIONES;

  readonly preset = signal('12m');
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

  readonly maximo = computed(() => {
    const actual = this.data();
    return actual ? Math.max(1, ...actual.porPeriodo.map((p) => p.cantidad)) : 1;
  });

  readonly hayDatos = computed(() => (this.data()?.resumen.total ?? 0) > 0);

  readonly etiquetaPreset = computed(
    () => this.presets.find((p) => p.id === this.preset())?.label ?? ''
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

  cambiarFecha(cual: 'desde' | 'hasta', event: Event): void {
    const valor = inputValue(event);
    if (cual === 'desde') this.desdeCustom.set(valor);
    else this.hastaCustom.set(valor);
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

  // ==================== GRÁFICOS ====================

  /** Altura de la barra en % (mínimo visible para que un turno no sea una línea). */
  altoBarra(cantidad: number): number {
    if (cantidad === 0) return 0;
    return Math.max(4, Math.round((cantidad / this.maximo()) * 100));
  }

  /** Ancho de la barra del ranking en % (mínimo visible para porcentajes chicos). */
  anchoBarra(porcentaje: number): number {
    return Math.max(porcentaje, 2);
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
      case 'anio':
        return { desde: `${hoy.getFullYear()}-01-01`, hasta };
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
