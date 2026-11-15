import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, maxLength, required } from '@angular/forms/signals';
import { FichaMascotaFormComponent } from './ficha-mascota-form.component';
import { FICHA_VACIA, FichaModel } from '../../historial-clinico.model';

/** Host de prueba: el formulario siempre lo construye el componente que lo usa. */
@Component({
  imports: [FichaMascotaFormComponent],
  template: `
    <app-ficha-mascota-form
      [fichaForm]="fichaForm"
      [guardando]="guardando()"
      (guardar)="guardados = guardados + 1"
    />
  `,
})
class HostComponent {
  readonly model = signal<FichaModel>({ ...FICHA_VACIA });
  readonly fichaForm = form(this.model, (p) => {
    required(p.nombre, { message: 'El nombre es obligatorio' });
    maxLength(p.nombre, 50, { message: 'Máximo 50 caracteres' });
  });
  readonly guardando = signal(false);
  guardados = 0;
}

describe('FichaMascotaFormComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('muestra los campos de la ficha y las observaciones del historial', () => {
    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Datos de la mascota');
    expect(texto).toContain('Observaciones del historial clínico');
    expect(fixture.nativeElement.querySelectorAll('input, select, textarea').length).toBe(8);
  });

  it('escribe en el modelo a través de [formField]', () => {
    const nombre: HTMLInputElement = fixture.nativeElement.querySelector('input');
    nombre.value = 'Firulais';
    nombre.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.model().nombre).toBe('Firulais');
  });

  it('emite guardar al enviar el formulario', () => {
    const formEl: HTMLFormElement = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();

    expect(host.guardados).toBe(1);
  });

  it('muestra el error del campo recién cuando fue tocado', () => {
    expect(fixture.nativeElement.textContent).not.toContain('El nombre es obligatorio');

    host.fichaForm().markAsTouched();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('El nombre es obligatorio');
  });

  it('deshabilita el botón mientras se está guardando', () => {
    host.guardando.set(true);
    fixture.detectChanges();

    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(boton.disabled).toBeTrue();
    expect(boton.textContent).toContain('Guardando...');
  });
});
