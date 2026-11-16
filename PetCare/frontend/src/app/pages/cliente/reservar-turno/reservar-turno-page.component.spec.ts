import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservarTurnoPageComponent } from './reservar-turno-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('ReservarTurnoPageComponent', () => {
  let fixture: ComponentFixture<ReservarTurnoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservarTurnoPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(ReservarTurnoPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
