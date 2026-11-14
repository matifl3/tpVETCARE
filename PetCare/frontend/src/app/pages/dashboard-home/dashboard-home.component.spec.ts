import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHomeComponent } from './dashboard-home.component';
import { AuthService } from '../../core/auth.service';
import { providersDePrueba, USUARIO_CLIENTE } from '../../testing/test-utils';

describe('DashboardHomeComponent', () => {
  let fixture: ComponentFixture<DashboardHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHomeComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_CLIENTE);

    fixture = TestBed.createComponent(DashboardHomeComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('actualiza el saludo cuando cambia el usuario logueado', () => {
    const auth = TestBed.inject(AuthService);
    const titulo = () => (fixture.nativeElement.querySelector('h1') as HTMLElement).textContent ?? '';

    expect(titulo()).toContain('Ana');

    auth.user.set({ ...USUARIO_CLIENTE, nombre: 'Beto' });
    fixture.detectChanges();

    expect(titulo()).toContain('Beto');
  });
});
