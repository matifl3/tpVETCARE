import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeriodoFiltrosComponent } from './periodo-filtros.component';
import { AGRUPACIONES, PRESETS, Preset } from '../../estadisticas.model';

describe('PeriodoFiltrosComponent', () => {
  let fixture: ComponentFixture<PeriodoFiltrosComponent>;
  let component: PeriodoFiltrosComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodoFiltrosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeriodoFiltrosComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('preset', 'anio');
    fixture.componentRef.setInput('agrupacion', 'MES');
    fixture.componentRef.setInput('presets', PRESETS);
    fixture.componentRef.setInput('agrupaciones', AGRUPACIONES);
    fixture.detectChanges();
  });

  /** Botones del bloque de presets (los primeros del componente). */
  function botonesPresets(): HTMLButtonElement[] {
    return Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('.stats-filters-row:first-child .tab-btn'),
    );
  }

  it('muestra todos los presets y la agrupación activa', () => {
    expect(botonesPresets().length).toBe(PRESETS.length);

    const activos = Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('.tab-btn.active'),
    ).map((b) => b.textContent?.trim());
    expect(activos).toContain('Este año');
    expect(activos).toContain('Mes');
  });

  it('emite el preset elegido al hacer click', () => {
    let elegido: Preset | undefined;
    component.presetElegido.subscribe((p) => (elegido = p));

    const boton30d = botonesPresets().find((b) => b.textContent?.includes('Últimos 30 días'))!;
    boton30d.click();

    expect(elegido?.id).toBe('30d');
  });

  it('emite la agrupación elegida', () => {
    let agrupacion = '';
    component.agrupacionCambiada.subscribe((a) => (agrupacion = a));

    const botonDia = Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('.tab-btn'),
    ).find((b) => b.textContent?.trim() === 'Día')!;
    botonDia.click();

    expect(agrupacion).toBe('DIA');
  });

  it('no muestra las fechas si el preset no es personalizado', () => {
    expect(fixture.nativeElement.querySelectorAll('input[type="date"]').length).toBe(0);
  });

  it('muestra las fechas y las emite cuando el preset es personalizado', () => {
    fixture.componentRef.setInput('preset', 'custom');
    fixture.componentRef.setInput('desde', '2026-01-01');
    fixture.componentRef.setInput('hasta', '2026-06-30');
    fixture.detectChanges();

    const inputs: HTMLInputElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="date"]'),
    );
    expect(inputs.length).toBe(2);
    expect(inputs[0].value).toBe('2026-01-01');
    expect(inputs[1].value).toBe('2026-06-30');

    const cambios: Array<{ cual: 'desde' | 'hasta'; valor: string }> = [];
    component.fechaCambiada.subscribe((c) => cambios.push(c));

    inputs[0].value = '2026-02-01';
    inputs[0].dispatchEvent(new Event('change'));
    inputs[1].value = '2026-07-31';
    inputs[1].dispatchEvent(new Event('change'));

    expect(cambios).toEqual([
      { cual: 'desde', valor: '2026-02-01' },
      { cual: 'hasta', valor: '2026-07-31' },
    ]);
  });
});
