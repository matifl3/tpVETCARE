import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TipoMensaje } from '../../core/models';

@Component({
  selector: 'app-mensaje-alerta',
  templateUrl: './mensaje-alerta.component.html',
  styleUrl: './mensaje-alerta.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MensajeAlertaComponent {
  readonly mensaje = input<string | null | undefined>('');
  readonly mostrar = input(false);
  readonly tipo = input<TipoMensaje>('error');
}