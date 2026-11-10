import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisTurnosProfesionalPageComponent } from './mis-turnos-profesional-page.component';
import { AuthService } from '../../../core/auth.service';
import { providersDePrueba, USUARIO_PROFESIONAL } from '../../../testing/test-utils';

describe('MisTurnosProfesionalPageComponent', () => {
  let fixture: ComponentFixture<MisTurnosProfesionalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisTurnosProfesionalPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_PROFESIONAL);

    fixture = TestBed.createComponent(MisTurnosProfesionalPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
