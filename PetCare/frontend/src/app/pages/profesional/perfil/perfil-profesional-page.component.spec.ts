import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilProfesionalPageComponent } from './perfil-profesional-page.component';
import { AuthService } from '../../../core/auth.service';
import { providersDePrueba, USUARIO_PROFESIONAL } from '../../../testing/test-utils';

describe('PerfilProfesionalPageComponent', () => {
  let fixture: ComponentFixture<PerfilProfesionalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilProfesionalPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_PROFESIONAL);

    fixture = TestBed.createComponent(PerfilProfesionalPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
