import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { form, maxLength, min, required, validate } from '@angular/forms/signals';
import { forkJoin } from 'rxjs';
import { HistorialClinico, Mascota } from '../../../core/models';
import { HistorialClinicoService } from '../../../services/historial-clinico.service';
import { MascotaService } from '../../../services/mascota.service';
import { FICHA_VACIA, FichaModel, fechaHoy } from './historial-clinico.model';
import { FichaMascotaFormComponent } from './components/ficha-mascota-form/ficha-mascota-form.component';
import { VacunasSectionComponent } from './components/vacunas-section/vacunas-section.component';
import { MedicamentosSectionComponent } from './components/medicamentos-section/medicamentos-section.component';

/**
 * Página del historial clínico del veterinario.
 * Orquesta la carga (mascota + historial) y el guardado de la ficha; las
 * vacunas y los medicamentos viven en sus propias secciones.
 */
@Component({
  selector: 'app-historial-clinico-profesional-page',
  imports: [
    RouterLink,
    FichaMascotaFormComponent,
    VacunasSectionComponent,
    MedicamentosSectionComponent,
  ],
  templateUrl: './historial-clinico-profesional-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class HistorialClinicoProfesionalPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly mascotaService = inject(MascotaService);
  private readonly historialService = inject(HistorialClinicoService);

  protected idMascota = 0;

  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
  readonly guardando = signal(false);
  readonly mascota = signal<Mascota | null>(null);
  readonly historial = signal<HistorialClinico | null>(null);

  readonly fichaModel = signal<FichaModel>({ ...FICHA_VACIA });
  readonly fichaForm = form(this.fichaModel, (p) => {
    required(p.nombre, { message: 'El nombre es obligatorio' });
    maxLength(p.nombre, 50, { message: 'Máximo 50 caracteres' });
    required(p.especie, { message: 'La especie es obligatoria' });
    required(p.peso, { message: 'El peso es obligatorio' });
    min(p.peso, 0.1, { message: 'El peso debe ser mayor a 0' });
    validate(p.fechaNacimiento, (ctx) =>
      ctx.value() && ctx.value() > fechaHoy()
        ? { kind: 'fechaFutura', message: 'La fecha no puede ser futura' }
        : null,
    );
  });

  ngOnInit(): void {
    this.idMascota = Number(this.route.snapshot.paramMap.get('idMascota'));
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set('');
    forkJoin({
      mascota: this.mascotaService.buscarPorId(this.idMascota),
      historial: this.historialService.obtener(this.idMascota),
    }).subscribe({
      next: ({ mascota, historial }) => {
        this.mascota.set(mascota);
        this.historial.set(historial);
        this.fichaModel.set({
          nombre: mascota.nombre ?? '',
          especie: mascota.especie ?? '',
          raza: mascota.raza ?? '',
          sexo: mascota.sexo ?? '',
          peso: mascota.peso ?? null,
          fechaNacimiento: mascota.fechaNacimiento ?? '',
          observaciones: mascota.observaciones ?? '',
          observacionesHistorial: historial.observaciones ?? '',
        });
        this.fichaForm().reset();
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  /** Vuelve a pedir solo el historial (lo usan las secciones de vacunas y medicamentos). */
  recargarHistorial(): void {
    this.historialService.obtener(this.idMascota).subscribe({
      next: (historial) => this.historial.set(historial),
      error: (err) => this.error.set(err.message),
    });
  }

  guardarFicha(): void {
    this.error.set('');
    this.success.set('');

    if (this.fichaForm().invalid()) {
      this.fichaForm().markAsTouched();
      return;
    }

    const f = this.fichaModel();
    const mascota: Partial<Mascota> = {
      nombre: f.nombre.trim(),
      especie: f.especie,
      raza: f.raza.trim() || null,
      sexo: f.sexo || null,
      peso: f.peso,
      fechaNacimiento: f.fechaNacimiento || null,
      observaciones: f.observaciones.trim() || null,
    };

    this.guardando.set(true);
    forkJoin({
      mascota: this.mascotaService.actualizarVeterinario(this.idMascota, mascota),
      historial: this.historialService.actualizar(this.idMascota, {
        observaciones: f.observacionesHistorial.trim(),
      }),
    }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.success.set('Datos guardados correctamente');
        this.cargar();
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err.message);
        this.cargar();
      },
    });
  }
}
