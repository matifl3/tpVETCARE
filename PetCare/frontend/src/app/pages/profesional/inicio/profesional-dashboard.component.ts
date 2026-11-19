import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { ROL_LABELS_DASHBOARD, SessionUser } from '../../../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-profesional-dashboard',
    imports: [RouterLink],
    templateUrl: './profesional-dashboard.component.html',
    styleUrl: './profesional-dashboard.component.css'
})
export class ProfesionalDashboardComponent {
  private readonly auth = inject(AuthService);

  protected readonly user: SessionUser = this.auth.user()!;
  protected readonly info = ROL_LABELS_DASHBOARD[this.user.rol] || { icon: '👤', label: this.user.rol };
}
