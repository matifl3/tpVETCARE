import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
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

function historial(vacunas: Vacuna[] = [VACUNA], medicamentos: Medicamento[] = [MEDICAMENTO]): HistorialClinico {
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

const esVacunas = (metodo: string) => (req: HttpRequest<unknown>) =>
  req.method === metodo && req.url.includes(`/api/mascotas/${ID_MASCOTA}/historial/vacunas`);

const esMedicamentos = (metodo: string) => (req: HttpRequest<unknown>) =>
  req.method === metodo && req.url.includes(`/api/mascotas/${ID_MASCOTA}/historial/medicamentos`);

describe('HistorialClinicoProfesionalPageComponent', () => {
  let fixture: ComponentFixture<HistorialClinicoProfesionalPageComponent>;
  let component: HistorialClinicoProfesionalPageComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialClinicoProfesionalPageComponent],
      providers: [
        ...providersDePrueba(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ idMascota: String(ID_MASCOTA) }) },
          },
        },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HistorialClinicoProfesionalPageComponent);
    component = fixture.componentInstance;
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

    component.guardarFicha(new Event('submit'));

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

    component.guardarFicha(new Event('submit'));

    http.expectNone(esPutMascotaVeterinario);
    http.expectNone(esPutHistorial);
    expect(component.fichaForm.nombre().touched()).toBeTrue();
  });

  it('registra, edita y elimina vacunas', () => {
    cargarInicial();
    spyOn(window, 'confirm').and.returnValue(true);

    // Registrar
    component.nuevaVacuna();
    component.vacunaModel.set({
      nombre: 'Moquillo',
      lote: 'L-200',
      fechaAplicacion: '2026-03-01',
      fechaProximaDosis: '2027-03-01',
      observaciones: '',
    });
    component.guardarVacuna(new Event('submit'));

    const alta = http.expectOne(esVacunas('POST'));
    expect(alta.request.body.nombre).toBe('Moquillo');
    expect(alta.request.body.lote).toBe('L-200');
    alta.flush({ ...VACUNA, id: 12, nombre: 'Moquillo' });
    http.expectOne(esGetHistorial).flush(historial());

    // Editar
    component.editarVacuna(VACUNA);
    expect(component.vacunaModel().nombre).toBe('Antirrábica');
    component.vacunaModel.set({
      nombre: 'Antirrábica',
      lote: 'L-101',
      fechaAplicacion: '2026-01-10',
      fechaProximaDosis: '2027-01-10',
      observaciones: 'Dosis de refuerzo',
    });
    component.guardarVacuna(new Event('submit'));

    const edicion = http.expectOne(esVacunas('PUT'));
    expect(edicion.request.url).toContain('/vacunas/11');
    expect(edicion.request.body.lote).toBe('L-101');
    edicion.flush(VACUNA);
    http.expectOne(esGetHistorial).flush(historial());

    // Eliminar
    component.eliminarVacuna(VACUNA);

    const baja = http.expectOne(esVacunas('DELETE'));
    expect(baja.request.url).toContain('/vacunas/11');
    baja.flush(null);
    http.expectOne(esGetHistorial).flush(historial([]));
    fixture.detectChanges();

    expect(component.success()).toContain('eliminada correctamente');
  });

  it('no registra una vacuna sin los datos obligatorios', () => {
    cargarInicial();
    component.nuevaVacuna();

    component.guardarVacuna(new Event('submit'));

    http.expectNone(esVacunas('POST'));
    expect(component.vacunaForm.nombre().touched()).toBeTrue();
    expect(component.vacunaForm.lote().touched()).toBeTrue();
  });

  it('registra, edita y elimina medicamentos', () => {
    cargarInicial();
    spyOn(window, 'confirm').and.returnValue(true);

    // Registrar
    component.nuevoMedicamento();
    component.medicamentoModel.set({
      nombre: 'Ibuprofeno',
      dosis: '100 mg',
      frecuencia: 'Cada 8 horas',
      duracion: '3 días',
      fechaPrescripcion: '2026-04-01',
      indicaciones: '',
    });
    component.guardarMedicamento(new Event('submit'));

    const alta = http.expectOne(esMedicamentos('POST'));
    expect(alta.request.body.nombre).toBe('Ibuprofeno');
    expect(alta.request.body.dosis).toBe('100 mg');
    alta.flush({ ...MEDICAMENTO, id: 22, nombre: 'Ibuprofeno' });
    http.expectOne(esGetHistorial).flush(historial());

    // Editar
    component.editarMedicamento(MEDICAMENTO);
    expect(component.medicamentoModel().nombre).toBe('Amoxicilina');
    component.medicamentoModel.set({
      nombre: 'Amoxicilina',
      dosis: '500 mg',
      frecuencia: 'Cada 12 horas',
      duracion: '10 días',
      fechaPrescripcion: '2026-02-01',
      indicaciones: 'Con comida',
    });
    component.guardarMedicamento(new Event('submit'));

    const edicion = http.expectOne(esMedicamentos('PUT'));
    expect(edicion.request.url).toContain('/medicamentos/21');
    expect(edicion.request.body.dosis).toBe('500 mg');
    edicion.flush(MEDICAMENTO);
    http.expectOne(esGetHistorial).flush(historial());

    // Eliminar
    component.eliminarMedicamento(MEDICAMENTO);

    const baja = http.expectOne(esMedicamentos('DELETE'));
    expect(baja.request.url).toContain('/medicamentos/21');
    baja.flush(null);
    http.expectOne(esGetHistorial).flush(historial([VACUNA], []));
    fixture.detectChanges();

    expect(component.success()).toContain('eliminado correctamente');
  });
});
