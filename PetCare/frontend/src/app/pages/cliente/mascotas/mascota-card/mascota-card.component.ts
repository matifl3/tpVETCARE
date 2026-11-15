import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Mascota } from '../../../../core/models';

@Component({
  selector: 'app-mascota-card',
  imports: [RouterLink],
  templateUrl: './mascota-card.component.html',
  styleUrl: './mascota-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MascotaCardComponent {
  readonly mascota = input.required<Mascota>();

  readonly editar = output<Mascota>();
  readonly eliminar = output<number>();
}