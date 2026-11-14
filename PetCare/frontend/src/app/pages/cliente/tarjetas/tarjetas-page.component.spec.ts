import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TarjetasPageComponent } from './tarjetas-page.component';
import { providersDePrueba } from '../../../testing/test-utils';


/** Busca un pedido cuyo método y final de URL coincidan. */
const pedido = (metodo: string, finUrl: string) => (req: HttpRequest<unknown>) =>
  req.method === metodo && req.url.endsWith(finUrl);

describe('TarjetasPageComponent', () => {
  let fixture: ComponentFixture<TarjetasPageComponent>;
  let component: TarjetasPageComponent;
  let http: HttpTestingController;

   beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetasPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TarjetasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    // Al iniciar, el componente pide la lista de tarjetas.
    http.expectOne(pedido('GET', '/api/tarjetas')).flush([]);
  });

  afterEach(() => http.verify());

  it('con el formulario vacío no envía nada', () => {
    component.agregar();

    http.expectNone(pedido('POST', '/api/tarjetas/agregar'));
    expect(component.form.controls.numeroTarjeta.touched).toBeTrue();
  });

  it('rechaza un número con letras o muy corto', () => {
    const numero = component.form.controls.numeroTarjeta;

    numero.setValue('1234abcd');
    expect(numero.hasError('pattern')).toBeTrue();

    numero.setValue('123456');
    expect(numero.hasError('pattern')).toBeTrue();
  });


  it('rechaza un vencimiento con formato inválido o vencido', () => {
    const vencimiento = component.form.controls.vencimiento;

    vencimiento.setValue('13/30');
    expect(vencimiento.hasError('pattern')).toBeTrue();

    vencimiento.setValue('01/20');
    expect(vencimiento.hasError('tarjetaVencida')).toBeTrue();
  });

   it('con datos válidos guarda la tarjeta y recarga la lista', () => {
    component.form.setValue({
      titular: 'Ana Pérez',
      numeroTarjeta: '4111111111111111',
      vencimiento: '12/99',
      cvv: '123',
    });

     component.agregar();

    const post = http.expectOne(pedido('POST', '/api/tarjetas/agregar'));
    expect(post.request.body.numeroTarjeta).toBe('4111111111111111');
    post.flush({});

    http.expectOne(pedido('GET', '/api/tarjetas')).flush([]);
  });
});