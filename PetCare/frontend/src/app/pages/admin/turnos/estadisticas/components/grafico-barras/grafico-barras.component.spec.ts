import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficoBarrasComponent } from './grafico-barras.component';
import { TurnoPeriodo } from '../../../../../../core/models';

const PERIODOS: TurnoPeriodo[] = [
  { periodo: '2026-01', etiqueta: 'Ene 2026', cantidad: 4 },
  { periodo: '2026-02', etiqueta: 'Feb 2026', cantidad: 8 },
  { periodo: '2026-03', etiqueta: 'Mar 2026', cantidad: 0 },
];

describe('GraficoBarrasComponent', () => {
  let fixture: ComponentFixture<GraficoBarrasComponent>;
  let component: GraficoBarrasComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoBarrasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoBarrasComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('periodos', PERIODOS);
    fixture.detectChanges();
  });

  it('calcula el máximo del período', () => {
    expect(component.maximo()).toBe(8);
  });

  it('usa 1 como máximo cuando no hay datos', () => {
    fixture.componentRef.setInput('periodos', []);
    fixture.detectChanges();

    expect(component.maximo()).toBe(1);
  });

  it('calcula la altura de cada barra en porcentaje', () => {
    expect(component.altoBarra(8)).toBe(100);
    expect(component.altoBarra(4)).toBe(50);
    // Las barras con valor nunca bajan del mínimo visible.
    expect(component.altoBarra(1)).toBe(13);
    // Una barra en cero no tiene altura.
    expect(component.altoBarra(0)).toBe(0);
  });

  it('dibuja una columna y una etiqueta por período', () => {
    expect(fixture.nativeElement.querySelectorAll('.chart-col').length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('.chart-label').length).toBe(3);

    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Ene 2026');
    expect(texto).toContain('Feb 2026');
    expect(texto).toContain('Máximo: 8');
  });

  it('aplica la altura calculada a las barras', () => {
    const barras: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.chart-bar'),
    );

    expect(barras[0].style.height).toBe('50%');
    expect(barras[1].style.height).toBe('100%');
    expect(barras[2].style.height).toBe('0%');
  });
});
