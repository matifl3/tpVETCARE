import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TiendaPageComponent } from './tienda-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('TiendaPageComponent', () => {
  let fixture: ComponentFixture<TiendaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendaPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(TiendaPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
