import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { MascotasPageComponent } from './mascotas-page.component';
import { AuthService } from '../../../core/auth.service';
import { Mascota } from '../../../core/models';
import { providersDePrueba, USUARIO_CLIENTE } from '../../../testing/test-utils';

const MASCOTAS: Mascota[] = [
  { idMascota: 1, nombre: 'Firulais', especie: 'PERRO' },
  { idMascota: 2, nombre: 'Michi', especie: 'GATO' },
];

describe('MascotasPageComponent', () => {
  let fixture: ComponentFixture<MascotasPageComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotasPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_CLIENTE);
    http = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(MascotasPageComponent);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('al iniciar pide las mascotas del usuario y las muestra', () => {
    http.expectOne('/api/mascotas/mias').flush(MASCOTAS);
    fixture.detectChanges();

    const nombres = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('h3')).map((h) =>
      h.textContent?.trim()
    );
    expect(nombres).toContain('Firulais');
    expect(nombres).toContain('Michi');
  });

  it('si falla la carga muestra el error', () => {
    http
      .expectOne('/api/mascotas/mias')
      .flush({ error: 'Algo salió mal' }, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    const alerta: HTMLElement = fixture.nativeElement.querySelector('.alert-error');
    expect(alerta.textContent).toContain('Algo salió mal');
  });
});
