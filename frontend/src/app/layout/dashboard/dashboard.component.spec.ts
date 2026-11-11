import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/auth.service';
import { providersDePrueba, USUARIO_CLIENTE } from '../../testing/test-utils';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let auth: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    auth.user.set(USUARIO_CLIENTE);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);

    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('cerrar sesión borra el token y vuelve al login', () => {
    localStorage.setItem('petcare_token', 'token-123');

    fixture.componentInstance.handleLogout();

    expect(auth.getToken()).toBeNull();
    expect(auth.user()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
