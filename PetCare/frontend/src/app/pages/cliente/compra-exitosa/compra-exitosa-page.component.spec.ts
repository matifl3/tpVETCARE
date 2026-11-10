import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompraExitosaPageComponent } from './compra-exitosa-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('CompraExitosaPageComponent', () => {
  let fixture: ComponentFixture<CompraExitosaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraExitosaPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(CompraExitosaPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
