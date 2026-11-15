import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { FichaModel } from '../../historial-clinico.model';

/**
 * Formulario de datos físicos de la mascota + observaciones del historial.
 * Es presentacional: recibe el formulario ya construido por la página y
 * avisa cuando el usuario quiere guardar.
 */
@Component({
  selector: 'app-ficha-mascota-form',
  imports: [FormField],
  templateUrl: './ficha-mascota-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ficha-mascota-form.component.css',
})
export class FichaMascotaFormComponent {
  readonly fichaForm = input.required<FieldTree<FichaModel>>();
  readonly guardando = input(false);

  readonly guardar = output<void>();

  submit(event: Event): void {
    event.preventDefault();
    this.guardar.emit();
  }
}
