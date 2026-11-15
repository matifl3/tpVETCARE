import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ReporteService } from '../../../services/reporte.service';

type TipoReporte = 'ganancias' | 'ventas' | 'productos';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const ANIO_ACTUAL = new Date().getFullYear();

/**
 * Validador de GRUPO: mira dos campos juntos.
 * La fecha de fin no puede ser anterior a la de inicio.
 */
function rangoFechasValido(grupo: AbstractControl): ValidationErrors | null {
  const inicio = grupo.get('fechaInicio')?.value;
  const fin = grupo.get('fechaFin')?.value;
  if (!inicio || !fin) return null; // si falta alguna, avisa el required de cada campo
  return fin < inicio ? { rangoInvalido: true } : null;
}

@Component({
    selector: 'app-admin-reportes-page',
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './admin-reportes-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './admin-reportes-page.component.css'
})
export class AdminReportesPageComponent {
  private readonly reporteService = inject(ReporteService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly isArray = Array.isArray;
  protected readonly meses = MESES;

  readonly tipo = signal<TipoReporte>('ganancias');

  /** Filtro de "Ganancias" y "Productos más vendidos": año y mes. */
  readonly periodoMes = this.fb.group({
    anio: this.fb.control<number | null>(ANIO_ACTUAL, [
      Validators.required,
      Validators.min(2000),
      Validators.max(ANIO_ACTUAL),
    ]),
    mes: [new Date().getMonth() + 1, Validators.required],
  });

  /** Filtro de "Ventas": rango de fechas, con un validador que mira los dos campos. */
  readonly rangoFechas = this.fb.group(
    {
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    },
    { validators: rangoFechasValido },
  );

  /** Forma libre según el tipo de reporte (objeto o lista), igual que en el JSX. */
  readonly data = signal<any>(null);
  readonly error = signal('');
  readonly loading = signal(false);

  consultar(): void {
    // Según el tipo de reporte se valida un formulario u otro.
    const filtro = this.tipo() === 'ventas' ? this.rangoFechas : this.periodoMes;
    if (filtro.invalid) {
      filtro.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.loading.set(true);
    this.data.set(null);
    const { anio, mes } = this.periodoMes.getRawValue();
    const { fechaInicio, fechaFin } = this.rangoFechas.getRawValue();
    let req: Observable<any>;
    if (this.tipo() === 'ganancias') {
      req = this.reporteService.ganancias(Number(anio), mes);
    } else if (this.tipo() === 'ventas') {
      req = this.reporteService.ventas(fechaInicio, fechaFin);
    } else {
      req = this.reporteService.productosMasVendidos(Number(anio), mes);
    }
    req.subscribe({
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

  exportarPdf(): void {
    // Abre la ventana de impresión nativa formateada para guardar como PDF
    window.print();
  }

  exportarCsv(): void {
    const ventas = this.data();
    if (!Array.isArray(ventas) || ventas.length === 0) return;

    // Encabezados del CSV
    let csvContent = 'ID;Usuario;Total;Estado;Fecha\n';

    // Filas de datos
    ventas.forEach((v: any) => {
      const usuario = v.idUsuario || '—';
      const total = v.total ? v.total.toFixed(2) : '0.00';
      const estado = v.estado || '';
      const fecha = v.fechaCreacion || '';
      csvContent += `${v.id};"${usuario}";${total};${estado};${fecha}\n`;
    });

    // Crear Blob y forzar descarga
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const { fechaInicio, fechaFin } = this.rangoFechas.getRawValue();
    a.download = `reporte-ventas-${fechaInicio}-a-${fechaFin}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Genera un enlace temporal en el DOM para forzar la descarga del archivo binario.
   */
  private descargarArchivo(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}