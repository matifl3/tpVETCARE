import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesionalesPageComponent } from './profesionales-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('ProfesionalesPageComponent', () => {
  let fixture: ComponentFixture<ProfesionalesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesionalesPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesionalesPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
