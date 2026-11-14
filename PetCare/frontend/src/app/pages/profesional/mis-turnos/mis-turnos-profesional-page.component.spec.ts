import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { MisTurnosProfesionalPageComponent } from './mis-turnos-profesional-page.component';
import { AuthService } from '../../../core/auth.service';
import { providersDePrueba, USUARIO_PROFESIONAL } from '../../../testing/test-utils';

describe('MisTurnosProfesionalPageComponent', () => {
  let fixture: ComponentFixture<MisTurnosProfesionalPageComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisTurnosProfesionalPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_PROFESIONAL);
    http = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(MisTurnosProfesionalPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('cancela la petición de turnos al salir de la pantalla', () => {
    const pedido = http.expectOne(
      (r: HttpRequest<unknown>) => r.method === 'GET' && r.url.endsWith('/api/turnos/profesional/2'),
    );

    fixture.destroy();

    expect(pedido.cancelled).toBeTrue();
  });
});
