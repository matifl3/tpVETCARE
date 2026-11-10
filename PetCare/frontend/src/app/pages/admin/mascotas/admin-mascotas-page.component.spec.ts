import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMascotasPageComponent } from './admin-mascotas-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('AdminMascotasPageComponent', () => {
  let fixture: ComponentFixture<AdminMascotasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMascotasPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMascotasPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
