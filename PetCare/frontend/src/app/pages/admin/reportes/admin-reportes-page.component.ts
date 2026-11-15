import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReporteVentasComponent } from './components/reporte-ventas/reporte-ventas.component';
import { ReporteProductosComponent } from './components/reporte-productos/reporte-productos.component';
import { TipoReporte } from './resportes.model';
import { ReporteGananciasComponent } from './components/reporte-ganancia/reporte-ganancia.component';

@Component({
  selector: 'app-admin-reportes-page',
  imports: [
    RouterLink,
    ReporteGananciasComponent,
    ReporteVentasComponent,
    ReporteProductosComponent,
  ],
  templateUrl: './admin-reportes-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './admin-reportes-page.component.css',
})
export class AdminReportesPageComponent {
  readonly tipo = signal<TipoReporte>('ganancias');
}