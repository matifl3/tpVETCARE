import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MascotaCardComponent } from './mascota-card.component';

describe('MascotaCardComponent', () => {
  let component: MascotaCardComponent;
  let fixture: ComponentFixture<MascotaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotaCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MascotaCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mascota', {
      idMascota: 1,
      nombre: 'Firulais',
      especie: 'PERRO',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});