import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsuariosPageComponent } from './admin-usuarios-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('AdminUsuariosPageComponent', () => {
  let fixture: ComponentFixture<AdminUsuariosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsuariosPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsuariosPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
