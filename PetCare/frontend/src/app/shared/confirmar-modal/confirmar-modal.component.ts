import { Component, input, output } from '@angular/core';

export interface ConfirmacionPendiente {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  accion: () => void;
}

@Component({
  imports: [],
  selector: 'app-confirmar-modal',
  styleUrl: './confirmar-modal.component.css',
  templateUrl: './confirmar-modal.component.html',
})
export class ConfirmarModalComponent {

  readonly abierto = input<boolean>(true);
  readonly titulo = input<string>('Confirmar acción');
  readonly mensaje = input.required<string>();
  readonly textoConfirmar = input<string>('Confirmar');
  readonly textoCancelar = input<string>('Cancelar');
  readonly peligroso = input<boolean>(true);

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();
  
}
