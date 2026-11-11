import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesionalDashboardComponent } from './profesional-dashboard.component';
import { AuthService } from '../../../core/auth.service';
import { providersDePrueba, USUARIO_PROFESIONAL } from '../../../testing/test-utils';

describe('ProfesionalDashboardComponent', () => {
  let fixture: ComponentFixture<ProfesionalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesionalDashboardComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_PROFESIONAL);

    fixture = TestBed.createComponent(ProfesionalDashboardComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
