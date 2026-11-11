import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inputValue } from '../../../core/form.helpers';
import { Tarjeta } from '../../../core/models';
import { TarjetaService } from '../../../services/tarjeta.service';

interface TarjetaForm {
  titular: string;
  numeroTarjeta: string;
  vencimiento: string;
  cvv: string;
}

const FORM_VACIO: TarjetaForm = { titular: '', numeroTarjeta: '', vencimiento: '', cvv: '' };

@Component({
  selector: 'app-tarjetas-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tarjetas-page.component.html',
  styleUrl: './tarjetas-page.component.css',
})
export class TarjetasPageComponent implements OnInit {
  private readonly tarjetaService = inject(TarjetaService);

  protected readonly inputValue = inputValue;

  readonly tarjetas = signal<Tarjeta[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly mostrarForm = signal(false);
  readonly form = signal<TarjetaForm>({ ...FORM_VACIO });

  ngOnInit(): void {
    this.cargarTarjetas();
  }

  upd(patch: Partial<TarjetaForm>): void {
    this.form.set({ ...this.form(), ...patch });
  }

  cargarTarjetas(): void {
    this.tarjetaService.listar().subscribe({
      next: (data) => {
        this.tarjetas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  handleAgregar(event: Event): void {
    event.preventDefault();
    this.error.set('');
    this.tarjetaService.agregar({ ...this.form() }).subscribe({
      next: () => {
        this.success.set('Tarjeta agregada correctamente');
        this.mostrarForm.set(false);
        this.form.set({ ...FORM_VACIO });
        this.cargarTarjetas();
        setTimeout(() => this.success.set(''), 3000);
      },
      error: (err) => this.error.set(err.message),
    });
  }

  handleEliminar(id: number): void {
    if (!confirm('¿Eliminar esta tarjeta?')) return;
    this.tarjetaService.eliminar(id).subscribe({
      next: () => this.cargarTarjetas(),
      error: (err) => this.error.set(err.message),
    });
  }
}
