import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { CarritoPageComponent } from './carrito-page.component';
import { Carrito, Tarjeta } from '../../../core/models';
import { providersDePrueba } from '../../../testing/test-utils';

const CARRITO: Carrito = { id: 1, estado: 'ACTIVO', items: [], turnos: [], total: 5000 };
const TARJETA_GUARDADA = { idTarjeta: 7, titular: 'Ana', ultimosDigitos: '1111', vencimiento: '12/30' } as Tarjeta;

/** Busca un pedido cuyo método y final de URL coincidan. */
const pedido = (metodo: string, finUrl: string) => (req: HttpRequest<unknown>) =>
  req.method === metodo && req.url.endsWith(finUrl);

describe('CarritoPageComponent', () => {
  let fixture: ComponentFixture<CarritoPageComponent>;
  let component: CarritoPageComponent;
  let http: HttpTestingController;

  /** Responde los 3 pedidos que hace cargarDatos(): carrito, historial y tarjetas. */
  function responderCarga(tarjetas: Tarjeta[]): void {
    http.expectOne(pedido('GET', '/api/carrito')).flush(CARRITO);
    http.expectOne(pedido('GET', '/api/carrito/historial')).flush([]);
    http.expectOne(pedido('GET', '/api/tarjetas')).flush(tarjetas);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CarritoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Después de comprar, el componente espera 1 segundo y navega.
    // Con el reloj falso de Jasmine ese setTimeout no corre solo.
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    http.verify();
  });

  it('con una tarjeta nueva incompleta no compra y muestra los errores', () => {
    responderCarga([]);

    component.toggleNuevaTarjeta();
    component.handleComprar();

    http.expectNone(pedido('POST', '/api/carrito/comprar'));
    expect(component.tarjetaNueva.controls.numeroTarjeta.touched).toBeTrue();
  });

  it('con una tarjeta nueva válida compra enviando sus datos', () => {
    responderCarga([]);

    component.toggleNuevaTarjeta();
    component.tarjetaNueva.setValue({
      titular: 'Ana Pérez',
      numeroTarjeta: '4111111111111111',
      vencimiento: '12/99',
      cvv: '123',
    });
    component.handleComprar();

    const compra = http.expectOne(pedido('POST', '/api/carrito/comprar'));
    expect(compra.request.body.tarjetaNueva.numeroTarjeta).toBe('4111111111111111');
    expect(compra.request.body.idTarjetaGuardada).toBeUndefined();
    compra.flush(CARRITO);

    responderCarga([]); // después de comprar recarga los datos
  });

  it('con una tarjeta guardada compra sin pedir la tarjeta nueva', () => {
    responderCarga([TARJETA_GUARDADA]);

    component.handleComprar();

    const compra = http.expectOne(pedido('POST', '/api/carrito/comprar'));
    expect(compra.request.body.idTarjetaGuardada).toBe(7);
    expect(compra.request.body.tarjetaNueva).toBeUndefined();
    compra.flush(CARRITO);

    responderCarga([TARJETA_GUARDADA]);
  });
});
