import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { SeguimientoPageComponent } from './seguimiento-page.component';
import { AuthService } from '../../core/auth.service';
import { providersDePrueba, USUARIO_CLIENTE } from '../../testing/test-utils';

describe('SeguimientoPageComponent', () => {
  let fixture: ComponentFixture<SeguimientoPageComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_CLIENTE);
    http = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(SeguimientoPageComponent);
    fixture.componentRef.setInput('idMascota', '0');
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('cancela la petición de seguimiento al salir de la pantalla', () => {
    const pedido = http.expectOne(
      (r: HttpRequest<unknown>) =>
        r.method === 'GET' && r.url.endsWith('/api/mascotas/0/seguimiento'),
    );

    fixture.destroy();

    expect(pedido.cancelled).toBeTrue();
  });
});
