import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Tarjeta } from '../../../core/models';
import {
  PATRON_CVV,
  PATRON_NUMERO_TARJETA,
  PATRON_VENCIMIENTO,
  tarjetaNoVencida,
} from '../../../core/tarjeta.validators';
import { TarjetaService } from '../../../services/tarjeta.service';

@Component({
    selector: 'app-tarjetas-page',
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './tarjetas-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './tarjetas-page.component.css'
})
export class TarjetasPageComponent implements OnInit {
   private readonly tarjetaService = inject(TarjetaService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly tarjetas = signal<Tarjeta[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly mostrarForm = signal(false);
 

   readonly form = this.fb.group({
    titular: ['', [Validators.required, Validators.maxLength(60)]],
    numeroTarjeta: ['', [Validators.required, Validators.pattern(PATRON_NUMERO_TARJETA)]],
    vencimiento: ['', [Validators.required, Validators.pattern(PATRON_VENCIMIENTO), tarjetaNoVencida]],
    cvv: ['', [Validators.required, Validators.pattern(PATRON_CVV)]],
  });

  ngOnInit(): void {
    this.cargarTarjetas();
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

  toggleForm(): void {
    this.form.reset();
    this.mostrarForm.update((v)=> !v);
  }

  agregar(): void {
    if (this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    this.error.set('');
    this.tarjetaService.agregar(this.form.getRawValue()).subscribe({
      next: () => {
        this.success.set('Tarjeta agregada correctamente');
        this.mostrarForm.set(false);
        this.form.reset();
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