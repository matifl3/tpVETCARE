import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { AdminMascotasPageComponent } from './admin-mascotas-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('AdminMascotasPageComponent', () => {
  let fixture: ComponentFixture<AdminMascotasPageComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMascotasPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminMascotasPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('cancela la petición de mascotas al salir de la pantalla', () => {
    const pedido = http.expectOne(
      (r: HttpRequest<unknown>) => r.method === 'GET' && r.url.endsWith('/api/mascotas'),
    );

    fixture.destroy();

    expect(pedido.cancelled).toBeTrue();
  });
});
