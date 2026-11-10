import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTurnosPageComponent } from './admin-turnos-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('AdminTurnosPageComponent', () => {
  let fixture: ComponentFixture<AdminTurnosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTurnosPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTurnosPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
