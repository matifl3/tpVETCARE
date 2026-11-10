import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisPacientesProfesionalPageComponent } from './mis-pacientes-profesional-page.component';
import { AuthService } from '../../../core/auth.service';
import { providersDePrueba, USUARIO_PROFESIONAL } from '../../../testing/test-utils';

describe('MisPacientesProfesionalPageComponent', () => {
  let fixture: ComponentFixture<MisPacientesProfesionalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisPacientesProfesionalPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_PROFESIONAL);

    fixture = TestBed.createComponent(MisPacientesProfesionalPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
