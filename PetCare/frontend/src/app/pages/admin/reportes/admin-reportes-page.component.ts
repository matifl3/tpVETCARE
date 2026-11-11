import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { inputValue } from '../../../core/form.helpers';
import { ReporteService } from '../../../services/reporte.service';

type TipoReporte = 'ganancias' | 'ventas' | 'productos';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
    selector: 'app-admin-reportes-page',
    imports: [RouterLink],
    templateUrl: './admin-reportes-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './admin-reportes-page.component.css'
})
export class AdminReportesPageComponent {
  private readonly reporteService = inject(ReporteService);

  protected readonly inputValue = inputValue;
  protected readonly Number = Number;
  protected readonly isArray = Array.isArray;
  protected readonly meses = MESES;

  readonly tipo = signal<TipoReporte>('ganancias');
  readonly anio = signal(new Date().getFullYear());
  readonly mes = signal(new Date().getMonth() + 1);
  readonly fechaInicio = signal('');
  readonly fechaFin = signal('');
  /** Forma libre según el tipo de reporte (objeto o lista), igual que en el JSX. */
  readonly data = signal<any>(null);
  readonly error = signal('');
  readonly loading = signal(false);

  consultar(): void {
    this.error.set('');
    this.loading.set(true);
    this.data.set(null);
    let req: Observable<any>;
    if (this.tipo() === 'ganancias') {
      req = this.reporteService.ganancias(this.anio(), this.mes());
    } else if (this.tipo() === 'ventas') {
      req = this.reporteService.ventas(this.fechaInicio(), this.fechaFin());
    } else {
      req = this.reporteService.productosMasVendidos(this.anio(), this.mes());
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
    a.download = `reporte-ventas-${this.fechaInicio()}-a-${this.fechaFin()}.csv`;
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