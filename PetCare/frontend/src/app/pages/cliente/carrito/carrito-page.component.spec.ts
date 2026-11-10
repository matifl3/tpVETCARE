import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoPageComponent } from './carrito-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('CarritoPageComponent', () => {
  let fixture: ComponentFixture<CarritoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
