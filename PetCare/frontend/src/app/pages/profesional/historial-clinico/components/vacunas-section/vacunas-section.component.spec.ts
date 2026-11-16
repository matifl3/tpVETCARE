import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { VacunasSectionComponent } from './vacunas-section.component';
import { Vacuna } from '../../../../../core/models';
import { providersDePrueba } from '../../../../../testing/test-utils';

const ID_MASCOTA = 7;

const VACUNA: Vacuna = {
  id: 11,
  nombre: 'Antirrábica',
  lote: 'L-100',
  fechaAplicacion: '2026-01-10',
  fechaProximaDosis: '2027-01-10',
  observaciones: 'Sin reacciones',
  nombreProfesional: 'Juan',
};

const esVacunas = (metodo: string) => (req: HttpRequest<unknown>) =>
  req.method === metodo && req.url.includes(`/api/mascotas/${ID_MASCOTA}/historial/vacunas`);

describe('VacunasSectionComponent', () => {
  let fixture: ComponentFixture<VacunasSectionComponent>;
  let component: VacunasSectionComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacunasSectionComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(VacunasSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('idMascota', ID_MASCOTA);
    fixture.componentRef.setInput('vacunas', [VACUNA]);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('lista las vacunas recibidas', () => {
    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Antirrábica');
    expect(texto).toContain('L-100');
    expect(texto).toContain('Juan');
  });

  it('muestra el estado vacío cuando no hay vacunas', () => {
    fixture.componentRef.setInput('vacunas', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No hay vacunas registradas');
  });

  it('registra una vacuna y avisa para recargar el historial', () => {
    const exitos: string[] = [];
    let recargas = 0;
    component.exito.subscribe((m) => exitos.push(m));
    component.recargar.subscribe(() => (recargas += 1));

    component.nueva();
    component.vacunaModel.set({
      nombre: 'Moquillo',
      lote: 'L-200',
      fechaAplicacion: '2026-03-01',
      fechaProximaDosis: '2027-03-01',
      observaciones: '',
    });
    component.guardar(new Event('submit'));

    const alta = http.expectOne(esVacunas('POST'));
    expect(alta.request.body.nombre).toBe('Moquillo');
    expect(alta.request.body.lote).toBe('L-200');
    alta.flush({ ...VACUNA, id: 12, nombre: 'Moquillo' });

    expect(exitos).toContain('Vacuna registrada correctamente');
    expect(recargas).toBe(1);
    expect(component.mostrarForm()).toBeFalse();
  });

  it('edita una vacuna existente', () => {
    const exitos: string[] = [];
    component.exito.subscribe((m) => exitos.push(m));

    component.editar(VACUNA);
    expect(component.vacunaModel().nombre).toBe('Antirrábica');
    component.vacunaModel.set({
      nombre: 'Antirrábica',
      lote: 'L-101',
      fechaAplicacion: '2026-01-10',
      fechaProximaDosis: '2027-01-10',
      observaciones: 'Dosis de refuerzo',
    });
    component.guardar(new Event('submit'));

    const edicion = http.expectOne(esVacunas('PUT'));
    expect(edicion.request.url).toContain('/vacunas/11');
    expect(edicion.request.body.lote).toBe('L-101');
    edicion.flush(VACUNA);

    expect(exitos).toContain('Vacuna actualizada correctamente');
  });

  it('elimina una vacuna', () => {
    const exitos: string[] = [];
    component.exito.subscribe((m) => exitos.push(m));

    component.eliminar(VACUNA);
    expect(component.confirmacion()).not.toBeNull();
    component.confirmacion()?.accion();
    component.confirmacion.set(null);

    const baja = http.expectOne(esVacunas('DELETE'));
    expect(baja.request.url).toContain('/vacunas/11');
    baja.flush(null);

    expect(exitos).toContain('Vacuna eliminada correctamente');
  });

  it('no registra una vacuna sin los datos obligatorios', () => {
    component.nueva();
    component.guardar(new Event('submit'));

    http.expectNone(esVacunas('POST'));
    expect(component.vacunaForm.nombre().touched()).toBeTrue();
    expect(component.vacunaForm.lote().touched()).toBeTrue();
  });
});
