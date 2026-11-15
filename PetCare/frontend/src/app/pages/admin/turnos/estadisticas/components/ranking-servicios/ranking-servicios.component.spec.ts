import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankingServiciosComponent } from './ranking-servicios.component';
import { ServicioRanking } from '../../../../../../core/models';

const RANKING: ServicioRanking[] = [
  { servicio: 'VETERINARIO', cantidad: 8, porcentaje: 80 },
  { servicio: 'PASEADOR', cantidad: 2, porcentaje: 20 },
];

describe('RankingServiciosComponent', () => {
  let fixture: ComponentFixture<RankingServiciosComponent>;
  let component: RankingServiciosComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingServiciosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RankingServiciosComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ranking', RANKING);
    fixture.detectChanges();
  });

  it('lista los servicios con su posición y porcentaje', () => {
    const filas = fixture.nativeElement.querySelectorAll('.ranking-row');
    expect(filas.length).toBe(2);

    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('VETERINARIO');
    expect(texto).toContain('8 · 80.0%');
    expect(texto).toContain('PASEADOR');
    expect(texto).toContain('2 · 20.0%');
  });

  it('marca solo al primero como destacado', () => {
    const posiciones: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.ranking-pos'),
    );

    expect(posiciones[0].classList).toContain('ranking-pos-top');
    expect(posiciones[1].classList).not.toContain('ranking-pos-top');
    expect(posiciones[0].textContent?.trim()).toBe('1');
  });

  it('aplica el ancho del porcentaje a cada barra', () => {
    const barras: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.ranking-fill'),
    );

    expect(barras[0].style.width).toBe('80%');
    expect(barras[1].style.width).toBe('20%');
  });

  it('mantiene un ancho mínimo visible', () => {
    expect(component.anchoBarra(0.4)).toBe(2);
    expect(component.anchoBarra(35)).toBe(35);
  });

  it('muestra el estado vacío cuando no hay servicios', () => {
    fixture.componentRef.setInput('ranking', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sin servicios en el período');
    expect(fixture.nativeElement.querySelectorAll('.ranking-row').length).toBe(0);
  });
});
