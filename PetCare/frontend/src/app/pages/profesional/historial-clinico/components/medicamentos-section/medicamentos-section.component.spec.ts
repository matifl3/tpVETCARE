import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { MedicamentosSectionComponent } from './medicamentos-section.component';
import { Medicamento } from '../../../../../core/models';
import { providersDePrueba } from '../../../../../testing/test-utils';

const ID_MASCOTA = 7;

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

const esMedicamentos = (metodo: string) => (req: HttpRequest<unknown>) =>
  req.method === metodo && req.url.includes(`/api/mascotas/${ID_MASCOTA}/historial/medicamentos`);

describe('MedicamentosSectionComponent', () => {
  let fixture: ComponentFixture<MedicamentosSectionComponent>;
  let component: MedicamentosSectionComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentosSectionComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(MedicamentosSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('idMascota', ID_MASCOTA);
    fixture.componentRef.setInput('medicamentos', [MEDICAMENTO]);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('lista los medicamentos recibidos', () => {
    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Amoxicilina');
    expect(texto).toContain('250 mg');
    expect(texto).toContain('Tomar con comida');
  });

  it('muestra el estado vacío cuando no hay medicamentos', () => {
    fixture.componentRef.setInput('medicamentos', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No hay medicamentos registrados');
  });

  it('registra un medicamento y avisa para recargar el historial', () => {
    const exitos: string[] = [];
    let recargas = 0;
    component.exito.subscribe((m) => exitos.push(m));
    component.recargar.subscribe(() => (recargas += 1));

    component.nuevo();
    component.medicamentoModel.set({
      nombre: 'Ibuprofeno',
      dosis: '100 mg',
      frecuencia: 'Cada 8 horas',
      duracion: '3 días',
      fechaPrescripcion: '2026-04-01',
      indicaciones: '',
    });
    component.guardar(new Event('submit'));

    const alta = http.expectOne(esMedicamentos('POST'));
    expect(alta.request.body.nombre).toBe('Ibuprofeno');
    expect(alta.request.body.dosis).toBe('100 mg');
    alta.flush({ ...MEDICAMENTO, id: 22, nombre: 'Ibuprofeno' });

    expect(exitos).toContain('Medicamento registrado correctamente');
    expect(recargas).toBe(1);
  });

  it('edita un medicamento existente', () => {
    const exitos: string[] = [];
    component.exito.subscribe((m) => exitos.push(m));

    component.editar(MEDICAMENTO);
    expect(component.medicamentoModel().nombre).toBe('Amoxicilina');
    component.medicamentoModel.set({
      nombre: 'Amoxicilina',
      dosis: '500 mg',
      frecuencia: 'Cada 12 horas',
      duracion: '10 días',
      fechaPrescripcion: '2026-02-01',
      indicaciones: 'Con comida',
    });
    component.guardar(new Event('submit'));

    const edicion = http.expectOne(esMedicamentos('PUT'));
    expect(edicion.request.url).toContain('/medicamentos/21');
    expect(edicion.request.body.dosis).toBe('500 mg');
    edicion.flush(MEDICAMENTO);

    expect(exitos).toContain('Medicamento actualizado correctamente');
  });

  it('elimina un medicamento', () => {
    const exitos: string[] = [];
    component.exito.subscribe((m) => exitos.push(m));

    component.eliminar(MEDICAMENTO);
    expect(component.confirmacion()).not.toBeNull();
    component.confirmacion()?.accion();
    component.confirmacion.set(null);

    const baja = http.expectOne(esMedicamentos('DELETE'));
    expect(baja.request.url).toContain('/medicamentos/21');
    baja.flush(null);

    expect(exitos).toContain('Medicamento eliminado correctamente');
  });

  it('no registra un medicamento sin los datos obligatorios', () => {
    component.nuevo();
    component.guardar(new Event('submit'));

    http.expectNone(esMedicamentos('POST'));
    expect(component.medicamentoForm.nombre().touched()).toBeTrue();
    expect(component.medicamentoForm.dosis().touched()).toBeTrue();
    expect(component.medicamentoForm.frecuencia().touched()).toBeTrue();
  });
});
