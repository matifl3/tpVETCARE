import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiGridComponent } from './kpi-grid.component';
import { ResumenTurnos } from '../../../../../../core/models';

const RESUMEN: ResumenTurnos = {
  total: 42,
  confirmados: 30,
  cancelados: 5,
  proximos: 12,
  servicioTop: 'VETERINARIO',
};

describe('KpiGridComponent', () => {
  let fixture: ComponentFixture<KpiGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiGridComponent);
    fixture.componentRef.setInput('resumen', RESUMEN);
    fixture.componentRef.setInput('etiquetaPreset', 'Este año');
    fixture.detectChanges();
  });

  it('muestra los cinco indicadores con sus valores', () => {
    const valores = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('.kpi-value'),
    ).map((v) => v.textContent?.trim());

    expect(valores).toEqual(['42', '30', '5', '12', 'VETERINARIO']);
    expect(fixture.nativeElement.querySelectorAll('.kpi-card').length).toBe(5);
  });

  it('muestra la etiqueta del período en la primera tarjeta', () => {
    const primera = fixture.nativeElement.querySelector('.kpi-card') as HTMLElement;
    expect(primera.textContent).toContain('Este año');
  });

  it('actualiza los valores cuando cambia el resumen', () => {
    fixture.componentRef.setInput('resumen', {
      ...RESUMEN,
      total: 3,
      servicioTop: 'PASEADOR',
    });
    fixture.detectChanges();

    const valores = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('.kpi-value'),
    ).map((v) => v.textContent?.trim());

    expect(valores[0]).toBe('3');
    expect(valores[4]).toBe('PASEADOR');
  });
});
