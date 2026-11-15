import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { MisPacientesProfesionalPageComponent } from './mis-pacientes-profesional-page.component';
import { AuthService } from '../../../core/auth.service';
import { Mascota, SessionUser } from '../../../core/models';
import { providersDePrueba, USUARIO_PROFESIONAL } from '../../../testing/test-utils';

const MASCOTA: Mascota = {
  idMascota: 7,
  nombre: 'Firulais',
  especie: 'PERRO',
  raza: 'Mestizo',
  sexo: 'MACHO',
};

const USUARIO_ADIESTRADOR: SessionUser = {
  ...USUARIO_PROFESIONAL,
  id: 5,
  nombre: 'Pedro',
  rol: 'ADIESTRADOR',
};

const esGetAtendidas = (idProfesional: number) => (req: HttpRequest<unknown>) =>
  req.method === 'GET' && req.url.endsWith(`/api/mascotas/atendidas/${idProfesional}`);

/** Texto de los links de la tabla de pacientes. */
function textosDeLinks(fixture: ComponentFixture<MisPacientesProfesionalPageComponent>): string[] {
  return Array.from<HTMLAnchorElement>(fixture.nativeElement.querySelectorAll('a')).map((a) =>
    a.textContent?.trim() ?? ''
  );
}

describe('MisPacientesProfesionalPageComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisPacientesProfesionalPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_PROFESIONAL);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('carga los pacientes del profesional logueado', () => {
    const fixture = TestBed.createComponent(MisPacientesProfesionalPageComponent);
    fixture.detectChanges();

    http.expectOne(esGetAtendidas(USUARIO_PROFESIONAL.id)).flush([MASCOTA]);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Firulais');
  });

  it('el veterinario ve "Ver detalles" y no "Seguimiento"', () => {
    const fixture = TestBed.createComponent(MisPacientesProfesionalPageComponent);
    fixture.detectChanges();

    http.expectOne(esGetAtendidas(USUARIO_PROFESIONAL.id)).flush([MASCOTA]);
    fixture.detectChanges();

    const links = textosDeLinks(fixture);
    expect(links).toContain('Ver detalles');
    expect(links).not.toContain('Seguimiento');
  });

  it('el adiestrador ve "Seguimiento" y no "Ver detalles"', () => {
    TestBed.inject(AuthService).user.set(USUARIO_ADIESTRADOR);

    const fixture = TestBed.createComponent(MisPacientesProfesionalPageComponent);
    fixture.detectChanges();

    http.expectOne(esGetAtendidas(USUARIO_ADIESTRADOR.id)).flush([MASCOTA]);
    fixture.detectChanges();

    const links = textosDeLinks(fixture);
    expect(links).toContain('Seguimiento');
    expect(links).not.toContain('Ver detalles');
  });
});
