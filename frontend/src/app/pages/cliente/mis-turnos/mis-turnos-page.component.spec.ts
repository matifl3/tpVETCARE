import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisTurnosPageComponent } from './mis-turnos-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('MisTurnosPageComponent', () => {
  let fixture: ComponentFixture<MisTurnosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisTurnosPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(MisTurnosPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
