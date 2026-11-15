import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NonNullableFormBuilder } from '@angular/forms';
import { TarjetaFormComponent, TarjetaFormGroup, crearFormTarjeta } from './tarjeta-form.component';

describe('TarjetaFormComponent', () => {
  let fixture: ComponentFixture<TarjetaFormComponent>;
  let form: TarjetaFormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaFormComponent],
    }).compileComponents();

    // Hacemos de "padre": creamos el formulario y se lo pasamos al input [form].
    form = crearFormTarjeta(TestBed.inject(NonNullableFormBuilder));
    fixture = TestBed.createComponent(TarjetaFormComponent);
    fixture.componentRef.setInput('form', form);
    fixture.detectChanges();
  });

  function errores(): string[] {
    return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.error-campo')).map((e) =>
      e.textContent!.trim()
    );
  }

  it('lo que se escribe en un input llega al formulario del padre', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="vencimiento"]');

    input.value = '01/20';
    input.dispatchEvent(new Event('input'));

    expect(form.controls.vencimiento.value).toBe('01/20');
  });

  it('no muestra errores si nadie tocó los campos', () => {
    expect(errores()).toEqual([]);
  });

  it('muestra el error de cada campo cuando el padre marca todo como tocado', () => {
    form.controls.vencimiento.setValue('01/20');
    form.markAllAsTouched();
    fixture.detectChanges();

    expect(errores()).toContain('El titular es obligatorio');
    expect(errores()).toContain('La tarjeta está vencida');
  });
});