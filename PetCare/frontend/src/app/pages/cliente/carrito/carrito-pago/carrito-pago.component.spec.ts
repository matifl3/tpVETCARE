import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoPagoComponent } from './carrito-pago.component';

describe('CarritoPagoComponent', () => {
  let component: CarritoPagoComponent;
  let fixture: ComponentFixture<CarritoPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoPagoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CarritoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
