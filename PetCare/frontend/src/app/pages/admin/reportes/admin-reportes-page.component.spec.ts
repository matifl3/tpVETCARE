import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminReportesPageComponent } from './admin-reportes-page.component';
import { providersDePrueba } from '../../../testing/test-utils';

describe('AdminReportesPageComponent', () => {
  let fixture: ComponentFixture<AdminReportesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReportesPageComponent],
      providers: providersDePrueba(),
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReportesPageComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
