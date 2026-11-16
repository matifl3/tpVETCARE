import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ReporteVenta } from '../../../../../core/models';
import { ReporteService } from '../../../../../services/reporte.service';
import { MensajeAlertaComponent } from '../../../../../shared/mensaje-alerta/mensaje-alerta.component';

function rangoFechasValido(grupo: AbstractControl): ValidationErrors | null {
  const inicio = grupo.get('fechaInicio')?.value;
  const fin = grupo.get('fechaFin')?.value;
  if (!inicio || !fin) return null;
  return fin < inicio ? { rangoInvalido: true } : null;
}

@Component({
  selector: 'app-reporte-ventas',
  imports: [ReactiveFormsModule, MensajeAlertaComponent],
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css', '../../reportes-filtros.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReporteVentasComponent {
  private readonly reporteService = inject(ReporteService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly isArray = Array.isArray;

  readonly rangoFechas = this.fb.group(
    {
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    },
    { validators: rangoFechasValido },
  );

  readonly data = signal<ReporteVenta[] | null>(null);
  readonly error = signal('');
  readonly loading = signal(false);

  consultar(): void {
    if (this.rangoFechas.invalid) {
      this.rangoFechas.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.loading.set(true);
    this.data.set(null);

    const { fechaInicio, fechaFin } = this.rangoFechas.getRawValue();
    this.reporteService.ventas(fechaInicio, fechaFin).subscribe({
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

  exportarCsv(): void {
    const ventas = this.data();
    if (!Array.isArray(ventas) || ventas.length === 0) return;

    let csvContent = 'ID;Usuario;Total;Estado;Fecha\n';

    ventas.forEach((v) => {
      const usuario = v.idUsuario ?? '—';
      const total = v.total ? v.total.toFixed(2) : '0.00';
      const estado = v.estado || '';
      const fecha = v.fechaCreacion || '';
      csvContent += `${v.id};"${usuario}";${total};${estado};${fecha}\n`;
    });

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const { fechaInicio, fechaFin } = this.rangoFechas.getRawValue();
    this.descargarArchivo(blob, `reporte-ventas-${fechaInicio}-a-${fechaFin}.csv`);
  }

  private descargarArchivo(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportarPdf(): void {
    window.print();
  }
}