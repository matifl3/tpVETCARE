import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { HistorialClinicoProfesionalPageComponent } from './historial-clinico-profesional-page.component';
import { HistorialClinico, Mascota, Medicamento, Vacuna } from '../../../core/models';
import { providersDePrueba } from '../../../testing/test-utils';

const ID_MASCOTA = 7;

const MASCOTA: Mascota = {
  idMascota: ID_MASCOTA,
  nombre: 'Firulais',
  especie: 'PERRO',
  raza: 'Mestizo',
  sexo: 'MACHO',
  peso: 12.5,
  fechaNacimiento: '2020-05-01',
  observaciones: 'Sin alergias conocidas',
};

const VACUNA: Vacuna = {
  id: 11,
  nombre: 'Antirrábica',
  lote: 'L-100',
  fechaAplicacion: '2026-01-10',
  fechaProximaDosis: '2027-01-10',
  observaciones: 'Sin reacciones',
  nombreProfesional: 'Juan',
};

const MEDICAMENTO: Medicamento = {
  id: 21,
  nombre: 'Amoxicilina',
  dosis: '250 mg',
  frecuencia: 'Cada 12 horas',
  duracion: '7 días',
  fechaPrescripcion: '2026-02-01',
  indicaciones: 'Tomar con comida',
  nombreProfesional: 'Juan',
};

function historial(
  vacunas: Vacuna[] = [VACUNA],
  medicamentos: Medicamento[] = [MEDICAMENTO],
): HistorialClinico {
  return {
    id: 3,
    idMascota: ID_MASCOTA,
    nombreMascota: MASCOTA.nombre,
    observaciones: 'Paciente estable',
    vacunas,
    medicamentos,
  };
}

const esGetMascota = (req: HttpRequest<unknown>) =>
  req.method === 'GET' && req.url.endsWith(`/api/mascotas/${ID_MASCOTA}`);

const esGetHistorial = (req: HttpRequest<unknown>) =>
  req.method === 'GET' && req.url.endsWith(`/api/mascotas/${ID_MASCOTA}/historial`);

const esPutMascotaVeterinario = (req: HttpRequest<unknown>) =>
  req.method === 'PUT' && req.url.endsWith(`/api/mascotas/${ID_MASCOTA}/veterinario`);

const esPutHistorial = (req: HttpRequest<unknown>) =>
  req.method === 'PUT' && req.url.endsWith(`/api/mascotas/${ID_MASCOTA}/historial`);

describe('HistorialClinicoProfesionalPageComponent', () => {
  let fixture: ComponentFixture<HistorialClinicoProfesionalPageComponent>;
  let component: HistorialClinicoProfesionalPageComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialClinicoProfesionalPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HistorialClinicoProfesionalPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('idMascota', String(ID_MASCOTA));
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  /** Responde la carga inicial (mascota + historial) y renderiza. */
  function cargarInicial(datosHistorial: HistorialClinico = historial()): void {
    http.expectOne(esGetMascota).flush(MASCOTA);
    http.expectOne(esGetHistorial).flush(datosHistorial);
    fixture.detectChanges();
  }

  it('al iniciar carga la mascota y su historial clínico', () => {
    cargarInicial();

    expect(component.loading()).toBeFalse();
    expect(component.mascota()?.nombre).toBe('Firulais');
    expect(component.historial()?.id).toBe(3);

    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Firulais');
    expect(texto).toContain('Antirrábica');
    expect(texto).toContain('Amoxicilina');
  });

  it('guarda los datos de la mascota y las observaciones del historial', () => {
    cargarInicial();

    component.fichaModel.set({
      nombre: 'Firulais II',
      especie: 'PERRO',
      raza: 'Caniche',
      sexo: 'MACHO',
      peso: 13.2,
      fechaNacimiento: '2020-05-01',
      observaciones: 'Pelaje sano',
      observacionesHistorial: 'Control anual',
    });

    component.guardarFicha();

    const pedidoMascota = http.expectOne(esPutMascotaVeterinario);
    expect(pedidoMascota.request.body.nombre).toBe('Firulais II');
    expect(pedidoMascota.request.body.peso).toBe(13.2);
    expect(pedidoMascota.request.body.observaciones).toBe('Pelaje sano');

    const pedidoHistorial = http.expectOne(esPutHistorial);
    expect(pedidoHistorial.request.body.observaciones).toBe('Control anual');

    pedidoMascota.flush(MASCOTA);
    pedidoHistorial.flush(historial());

    // El guardado recarga mascota e historial.
    http.expectOne(esGetMascota).flush(MASCOTA);
    http.expectOne(esGetHistorial).flush(historial());
    fixture.detectChanges();

    expect(component.success()).toContain('guardados correctamente');
    expect(component.guardando()).toBeFalse();
  });

  it('no envía la ficha si los datos obligatorios están vacíos', () => {
    cargarInicial();

    component.fichaModel.set({
      nombre: '',
      especie: '',
      raza: '',
      sexo: '',
      peso: null,
      fechaNacimiento: '',
      observaciones: '',
      observacionesHistorial: '',
    });

    component.guardarFicha();

    http.expectNone(esPutMascotaVeterinario);
    http.expectNone(esPutHistorial);
    expect(component.fichaForm.nombre().touched()).toBeTrue();
  });

  it('delega el alta de vacunas en su sección', () => {
    cargarInicial();

    const boton = Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('button'),
    ).find((b) => b.textContent?.includes('Agregar vacuna'));
    expect(boton).toBeDefined();

    boton!.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nueva vacuna');
  });
});
