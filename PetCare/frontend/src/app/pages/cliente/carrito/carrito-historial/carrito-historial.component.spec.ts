import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoHistorialComponent } from './carrito-historial.component';

describe('CarritoHistorialComponent', () => {
  let component: CarritoHistorialComponent;
  let fixture: ComponentFixture<CarritoHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoHistorialComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CarritoHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
