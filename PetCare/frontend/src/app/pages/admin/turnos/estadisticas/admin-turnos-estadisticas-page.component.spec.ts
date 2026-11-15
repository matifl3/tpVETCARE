import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { AdminTurnosEstadisticasPageComponent } from './admin-turnos-estadisticas-page.component';
import { EstadisticasTurnos } from '../../../../core/models';
import { providersDePrueba } from '../../../../testing/test-utils';

const ESTADISTICAS: EstadisticasTurnos = {
  desde: '2026-01-01',
  hasta: '2026-12-31',
  agrupacion: 'MES',
  resumen: {
    total: 10,
    confirmados: 8,
    cancelados: 2,
    proximos: 4,
    servicioTop: 'VETERINARIO',
  },
  porPeriodo: [
    { periodo: '2026-01', etiqueta: 'Ene 2026', cantidad: 4 },
    { periodo: '2026-02', etiqueta: 'Feb 2026', cantidad: 6 },
  ],
  rankingServicios: [
    { servicio: 'VETERINARIO', cantidad: 8, porcentaje: 80 },
    { servicio: 'PASEADOR', cantidad: 2, porcentaje: 20 },
  ],
};

const esGetEstadisticas = (req: HttpRequest<unknown>) =>
  req.method === 'GET' && req.url.includes('/api/turnos/estadisticas');

describe('AdminTurnosEstadisticasPageComponent', () => {
  let fixture: ComponentFixture<AdminTurnosEstadisticasPageComponent>;
  let component: AdminTurnosEstadisticasPageComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTurnosEstadisticasPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminTurnosEstadisticasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('consulta el período por defecto al iniciar', () => {
    const pedido = http.expectOne(esGetEstadisticas);
    expect(pedido.request.urlWithParams).toContain('agrupacion=MES');
    expect(pedido.request.urlWithParams).toMatch(/desde=\d{4}-01-01/);
    pedido.flush(ESTADISTICAS);
    fixture.detectChanges();

    expect(component.loading()).toBeFalse();
    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Turnos en el período');
    expect(texto).toContain('Ene 2026');
    expect(texto).toContain('VETERINARIO');
  });

  it('vuelve a consultar al cambiar la agrupación', () => {
    http.expectOne(esGetEstadisticas).flush(ESTADISTICAS);
    fixture.detectChanges();

    component.cambiarAgrupacion('DIA');

    const pedido = http.expectOne(esGetEstadisticas);
    expect(pedido.request.urlWithParams).toContain('agrupacion=DIA');
    pedido.flush(ESTADISTICAS);
    fixture.detectChanges();

    expect(component.agrupacion()).toBe('DIA');
    expect(component.refreshing()).toBeFalse();
  });

  it('aplica la agrupación del preset elegido', () => {
    http.expectOne(esGetEstadisticas).flush(ESTADISTICAS);
    fixture.detectChanges();

    const preset30d = component.presets.find((p) => p.id === '30d')!;
    component.elegirPreset(preset30d);

    const pedido = http.expectOne(esGetEstadisticas);
    expect(pedido.request.urlWithParams).toContain('agrupacion=DIA');
    pedido.flush(ESTADISTICAS);

    expect(component.preset()).toBe('30d');
  });

  it('no consulta si el rango personalizado tiene las fechas invertidas', () => {
    http.expectOne(esGetEstadisticas).flush(ESTADISTICAS);
    fixture.detectChanges();

    const custom = component.presets.find((p) => p.id === 'custom')!;
    component.elegirPreset(custom);
    // Todavía faltan fechas: no hay request.
    expect(component.loading()).toBeFalse();

    component.cambiarFecha({ cual: 'desde', valor: '2026-05-01' });
    component.cambiarFecha({ cual: 'hasta', valor: '2026-01-01' });

    http.expectNone(esGetEstadisticas);
    expect(component.error()).toContain('posterior');
  });

  it('muestra el error del backend', () => {
    const pedido = http.expectOne(esGetEstadisticas);
    pedido.flush('boom', { status: 500, statusText: 'Error del servidor' });
    fixture.detectChanges();

    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('Error del servidor');
    expect(fixture.nativeElement.textContent).toContain('Error del servidor');
  });

  it('muestra el estado vacío cuando el período no tiene turnos', () => {
    http.expectOne(esGetEstadisticas).flush({
      ...ESTADISTICAS,
      resumen: { ...ESTADISTICAS.resumen, total: 0 },
      porPeriodo: [],
      rankingServicios: [],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No hay turnos en el período');
  });
});
