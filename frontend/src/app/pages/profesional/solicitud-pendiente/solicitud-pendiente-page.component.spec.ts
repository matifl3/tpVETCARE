import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPendientePageComponent } from './solicitud-pendiente-page.component';
import { AuthService } from '../../../core/auth.service';
import { providersDePrueba, USUARIO_PROFESIONAL } from '../../../testing/test-utils';

describe('SolicitudPendientePageComponent', () => {
  let fixture: ComponentFixture<SolicitudPendientePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudPendientePageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    TestBed.inject(AuthService).user.set(USUARIO_PROFESIONAL);

    fixture = TestBed.createComponent(SolicitudPendientePageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
