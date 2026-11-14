import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { MascotasPageComponent } from './mascotas-page.component';
import { AuthService } from '../../../core/auth.service';
import { Mascota } from '../../../core/models';
import { providersDePrueba, USUARIO_CLIENTE } from '../../../testing/test-utils';

const MASCOTAS: Mascota[] = [
  { idMascota: 1, nombre: 'Firulais', especie: 'PERRO' },
  { idMascota: 2, nombre: 'Michi', especie: 'GATO' },
];

/** Busca un pedido a /api/mascotas/mias con ese método (GET, POST...). */
const misMascotas = (metodo: string) => (req: HttpRequest<unknown>) =>
  req.method === metodo && req.url.endsWith('/api/mascotas/mias');

describe('MascotasPageComponent', () => {
  let fixture: ComponentFixture<MascotasPageComponent>;
  let component: MascotasPageComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotasPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_CLIENTE);
    http = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(MascotasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('al iniciar pide las mascotas del usuario y las muestra', () => {
    http.expectOne(misMascotas('GET')).flush(MASCOTAS);
    fixture.detectChanges();

    const nombres = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('h3')).map((h) =>
      h.textContent?.trim()
    );
    expect(nombres).toContain('Firulais');
    expect(nombres).toContain('Michi');
  });

  it('si falla la carga muestra el error', () => {
    http
      .expectOne(misMascotas('GET'))
      .flush({ error: 'Algo salió mal' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    const alerta: HTMLElement = fixture.nativeElement.querySelector('.alert-error');
    expect(alerta.textContent).toContain('Algo salió mal');
  });

  it('con el formulario vacío no envía nada y marca los campos como tocados', () => {
    http.expectOne(misMascotas('GET')).flush([]);

    component.guardar();

    http.expectNone(misMascotas('POST'));
    expect(component.form.invalid).toBeTrue();
    expect(component.form.controls.nombre.touched).toBeTrue();
  });

  it('no acepta una fecha de nacimiento futura', () => {
    http.expectOne(misMascotas('GET')).flush([]);

    component.form.controls.fechaNacimiento.setValue('2999-01-01');

    expect(component.form.controls.fechaNacimiento.hasError('fechaFutura')).toBeTrue();
  });

  it('con datos válidos crea la mascota y recarga la lista', () => {
    http.expectOne(misMascotas('GET')).flush([]);

    component.form.setValue({
      nombre: 'Toby',
      especie: 'PERRO',
      raza: 'Mestizo',
      sexo: 'MACHO',
      peso: 12,
      fechaNacimiento: '2020-05-01',
    });
    component.guardar();

    const pedido = http.expectOne(misMascotas('POST'));
    expect(pedido.request.body.nombre).toBe('Toby');
    expect(pedido.request.body.peso).toBe(12);
    pedido.flush({});

    http.expectOne(misMascotas('GET')).flush([]);
  });
});