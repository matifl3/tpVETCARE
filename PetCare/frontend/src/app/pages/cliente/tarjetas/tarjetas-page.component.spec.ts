import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetasPageComponent } from './tarjetas-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('TarjetasPageComponent', () => {
  let fixture: ComponentFixture<TarjetasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetasPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetasPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
