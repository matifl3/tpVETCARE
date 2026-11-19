import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmar-modal',
  templateUrl: './confirmar-modal.component.html',
  styleUrl: './confirmar-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmarModalComponent {
  readonly titulo = input.required<string>();
  readonly mensaje = input.required<string>();
  readonly textoConfirmar = input('Confirmar');

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();
}