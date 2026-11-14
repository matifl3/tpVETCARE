import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { ReservarTurnoPageComponent } from './reservar-turno-page.component';
import { Mascota, Profesional } from '../../../core/models';
import { providersDePrueba } from '../../../testing/test-utils';

const PROFESIONAL = { id: 0, nombre: 'Juan', apellido: 'Pérez', rol: 'VETERINARIO' } as Profesional;
const MASCOTAS: Mascota[] = [{ idMascota: 1, nombre: 'Firulais', especie: 'PERRO' }];

/** Matcher de la consulta de disponibilidad. */
const disponibilidad = (req: HttpRequest<unknown>) =>
  req.method === 'GET' && req.url.includes('/api/turnos/disponibilidad/');

describe('ReservarTurnoPageComponent', () => {
  let fixture: ComponentFixture<ReservarTurnoPageComponent>;
  let component: ReservarTurnoPageComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservarTurnoPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ReservarTurnoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Carga inicial del profesional y las mascotas.
    http.expectOne((r: HttpRequest<unknown>) => r.url.endsWith('/api/profesionales/0')).flush(PROFESIONAL);
    http.expectOne((r: HttpRequest<unknown>) => r.url.endsWith('/api/mascotas/mias')).flush(MASCOTAS);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(component).toBeTruthy();
  });

  it('consulta la disponibilidad recién después del debounce de 500 ms', fakeAsync(() => {
    component.onFecha('2026-11-20');
    fixture.detectChanges(); // propaga la signal y arranca el debounce
    tick(499);

    http.expectNone(disponibilidad);

    tick(1);
    const pedido = http.expectOne(disponibilidad);
    expect(pedido.request.url).toContain('fecha=2026-11-20');

    pedido.flush({ disponible: true });
    expect(component.disponible()).toBeTrue();
  }));

  it('cancela la consulta anterior al cambiar de fecha (switchMap)', fakeAsync(() => {
    component.onFecha('2026-11-20');
    fixture.detectChanges();
    tick(500);
    const primera = http.expectOne(disponibilidad);

    component.onFecha('2026-11-21');
    fixture.detectChanges();
    tick(500);
    const segunda = http.expectOne(disponibilidad);

    expect(primera.cancelled).toBeTrue();
    expect(segunda.request.url).toContain('fecha=2026-11-21');

    segunda.flush({ disponible: false });
    expect(component.disponible()).toBeFalse();
  }));

  it('cancela la consulta de disponibilidad al salir de la pantalla', fakeAsync(() => {
    component.onFecha('2026-11-20');
    fixture.detectChanges();
    tick(500);
    const pedido = http.expectOne(disponibilidad);

    fixture.destroy();

    expect(pedido.cancelled).toBeTrue();
  }));
});
