import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoItemsComponentComponent } from './carrito-items.component';

describe('CarritoItemsComponentComponent', () => {
  let component: CarritoItemsComponentComponent;
  let fixture: ComponentFixture<CarritoItemsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoItemsComponentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CarritoItemsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
