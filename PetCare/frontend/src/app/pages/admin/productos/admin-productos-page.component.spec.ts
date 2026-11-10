import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductosPageComponent } from './admin-productos-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('AdminProductosPageComponent', () => {
  let fixture: ComponentFixture<AdminProductosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductosPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductosPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
