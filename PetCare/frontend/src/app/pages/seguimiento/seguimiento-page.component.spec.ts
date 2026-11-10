import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguimientoPageComponent } from './seguimiento-page.component';
import { AuthService } from '../../core/auth.service';
import { providersDePrueba, USUARIO_CLIENTE } from '../../testing/test-utils';

describe('SeguimientoPageComponent', () => {
  let fixture: ComponentFixture<SeguimientoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_CLIENTE);

    fixture = TestBed.createComponent(SeguimientoPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
