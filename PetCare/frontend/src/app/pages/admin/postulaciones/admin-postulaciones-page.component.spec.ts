import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPostulacionesPageComponent } from './admin-postulaciones-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('AdminPostulacionesPageComponent', () => {
  let fixture: ComponentFixture<AdminPostulacionesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPostulacionesPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPostulacionesPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
