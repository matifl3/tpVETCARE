import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormField, form, maxLength, min, required, validate } from '@angular/forms/signals';
import { forkJoin } from 'rxjs';
import { HistorialClinico, Mascota, Medicamento, Vacuna } from '../../../core/models';
import { HistorialClinicoService } from '../../../services/historial-clinico.service';
import { MascotaService } from '../../../services/mascota.service';

interface FichaModel {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  peso: number | null;
  fechaNacimiento: string;
  observaciones: string;
  observacionesHistorial: string;
}

interface VacunaForm {
  nombre: string;
  lote: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  observaciones: string;
}

interface MedicamentoForm {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  fechaPrescripcion: string;
  indicaciones: string;
}

const FICHA_VACIA: FichaModel = {
  nombre: '',
  especie: '',
  raza: '',
  sexo: '',
  peso: null,
  fechaNacimiento: '',
  observaciones: '',
  observacionesHistorial: '',
};

const VACUNA_VACIA: VacunaForm = {
  nombre: '',
  lote: '',
  fechaAplicacion: '',
  fechaProximaDosis: '',
  observaciones: '',
};

const MEDICAMENTO_VACIO: MedicamentoForm = {
  nombre: '',
  dosis: '',
  frecuencia: '',
  duracion: '',
  fechaPrescripcion: '',
  indicaciones: '',
};

/** Fecha de hoy en formato YYYY-MM-DD (mismo criterio que el formulario de mascotas). */
function fechaHoy(): string {
  return new Date().toLocaleDateString('en-CA');
}

@Component({
  selector: 'app-historial-clinico-profesional-page',
  imports: [RouterLink, FormField],
  templateUrl: './historial-clinico-profesional-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './historial-clinico-profesional-page.component.css',
})
export class HistorialClinicoProfesionalPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly mascotaService = inject(MascotaService);
  private readonly historialService = inject(HistorialClinicoService);

  private idMascota = 0;

  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');
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

  readonly mostrarFormVacuna = signal(false);
  readonly vacunaEditandoId = signal<number | null>(null);
  readonly vacunaModel = signal<VacunaForm>({ ...VACUNA_VACIA });
  readonly vacunaForm = form(this.vacunaModel, (p) => {
    required(p.nombre, { message: 'El nombre de la vacuna es obligatorio' });
    required(p.lote, { message: 'El lote es obligatorio' });
    validate(p.fechaAplicacion, (ctx) =>
      ctx.value() && ctx.value() > fechaHoy()
        ? { kind: 'fechaFutura', message: 'La fecha de aplicación no puede ser futura' }
        : null,
    );
    validate(p.fechaProximaDosis, (ctx) =>
      ctx.value() && ctx.value() <= fechaHoy()
        ? { kind: 'fechaInvalida', message: 'La próxima dosis debe ser una fecha futura' }
        : null,
    );
  });

  readonly mostrarFormMedicamento = signal(false);
  readonly medicamentoEditandoId = signal<number | null>(null);
  readonly medicamentoModel = signal<MedicamentoForm>({ ...MEDICAMENTO_VACIO });
  readonly medicamentoForm = form(this.medicamentoModel, (p) => {
    required(p.nombre, { message: 'El nombre del medicamento es obligatorio' });
    required(p.dosis, { message: 'La dosis es obligatoria' });
    required(p.frecuencia, { message: 'La frecuencia es obligatoria' });
    validate(p.fechaPrescripcion, (ctx) =>
      ctx.value() && ctx.value() > fechaHoy()
        ? { kind: 'fechaFutura', message: 'La fecha de prescripción no puede ser futura' }
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

  private recargarHistorial(): void {
    this.historialService.obtener(this.idMascota).subscribe({
      next: (historial) => this.historial.set(historial),
      error: (err) => this.error.set(err.message),
    });
  }

  guardarFicha(event: Event): void {
    event.preventDefault();
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

    forkJoin({
      mascota: this.mascotaService.actualizarVeterinario(this.idMascota, mascota),
      historial: this.historialService.actualizar(this.idMascota, {
        observaciones: f.observacionesHistorial.trim(),
      }),
    }).subscribe({
      next: () => {
        this.success.set('Datos guardados correctamente');
        this.cargar();
      },
      error: (err) => {
        this.error.set(err.message);
        this.cargar();
      },
    });
  }

  nuevaVacuna(): void {
    this.vacunaEditandoId.set(null);
    this.vacunaModel.set({ ...VACUNA_VACIA });
    this.vacunaForm().reset();
    this.mostrarFormVacuna.set(true);
  }

  editarVacuna(vacuna: Vacuna): void {
    this.vacunaEditandoId.set(vacuna.id);
    this.vacunaModel.set({
      nombre: vacuna.nombre ?? '',
      lote: vacuna.lote ?? '',
      fechaAplicacion: vacuna.fechaAplicacion ?? '',
      fechaProximaDosis: vacuna.fechaProximaDosis ?? '',
      observaciones: vacuna.observaciones ?? '',
    });
    this.vacunaForm().reset();
    this.mostrarFormVacuna.set(true);
  }

  cancelarVacuna(): void {
    this.mostrarFormVacuna.set(false);
    this.vacunaEditandoId.set(null);
    this.vacunaModel.set({ ...VACUNA_VACIA });
    this.vacunaForm().reset();
  }

  guardarVacuna(event: Event): void {
    event.preventDefault();
    this.error.set('');
    this.success.set('');

    if (this.vacunaForm().invalid()) {
      this.vacunaForm().markAsTouched();
      return;
    }

    const v = this.vacunaModel();
    const payload = {
      nombre: v.nombre.trim(),
      lote: v.lote.trim(),
      fechaAplicacion: v.fechaAplicacion || null,
      fechaProximaDosis: v.fechaProximaDosis || null,
      observaciones: v.observaciones.trim() || null,
    };
    const id = this.vacunaEditandoId();
    const request = id
      ? this.historialService.actualizarVacuna(this.idMascota, id, payload)
      : this.historialService.registrarVacuna(this.idMascota, payload);

    request.subscribe({
      next: () => {
        this.success.set(id ? 'Vacuna actualizada correctamente' : 'Vacuna registrada correctamente');
        this.cancelarVacuna();
        this.recargarHistorial();
      },
      error: (err) => this.error.set(err.message),
    });
  }

  eliminarVacuna(vacuna: Vacuna): void {
    if (!confirm(`¿Eliminar la vacuna "${vacuna.nombre}"?`)) return;
    this.error.set('');
    this.success.set('');
    this.historialService.eliminarVacuna(this.idMascota, vacuna.id).subscribe({
      next: () => {
        this.success.set('Vacuna eliminada correctamente');
        if (this.vacunaEditandoId() === vacuna.id) this.cancelarVacuna();
        this.recargarHistorial();
      },
      error: (err) => this.error.set(err.message),
    });
  }

  nuevoMedicamento(): void {
    this.medicamentoEditandoId.set(null);
    this.medicamentoModel.set({ ...MEDICAMENTO_VACIO });
    this.medicamentoForm().reset();
    this.mostrarFormMedicamento.set(true);
  }

  editarMedicamento(medicamento: Medicamento): void {
    this.medicamentoEditandoId.set(medicamento.id);
    this.medicamentoModel.set({
      nombre: medicamento.nombre ?? '',
      dosis: medicamento.dosis ?? '',
      frecuencia: medicamento.frecuencia ?? '',
      duracion: medicamento.duracion ?? '',
      fechaPrescripcion: medicamento.fechaPrescripcion ?? '',
      indicaciones: medicamento.indicaciones ?? '',
    });
    this.medicamentoForm().reset();
    this.mostrarFormMedicamento.set(true);
  }

  cancelarMedicamento(): void {
    this.mostrarFormMedicamento.set(false);
    this.medicamentoEditandoId.set(null);
    this.medicamentoModel.set({ ...MEDICAMENTO_VACIO });
    this.medicamentoForm().reset();
  }

  guardarMedicamento(event: Event): void {
    event.preventDefault();
    this.error.set('');
    this.success.set('');

    if (this.medicamentoForm().invalid()) {
      this.medicamentoForm().markAsTouched();
      return;
    }

    const m = this.medicamentoModel();
    const payload = {
      nombre: m.nombre.trim(),
      dosis: m.dosis.trim(),
      frecuencia: m.frecuencia.trim(),
      duracion: m.duracion.trim() || null,
      fechaPrescripcion: m.fechaPrescripcion || null,
      indicaciones: m.indicaciones.trim() || null,
    };
    const id = this.medicamentoEditandoId();
    const request = id
      ? this.historialService.actualizarMedicamento(this.idMascota, id, payload)
      : this.historialService.registrarMedicamento(this.idMascota, payload);

    request.subscribe({
      next: () => {
        this.success.set(
          id ? 'Medicamento actualizado correctamente' : 'Medicamento registrado correctamente',
        );
        this.cancelarMedicamento();
        this.recargarHistorial();
      },
      error: (err) => this.error.set(err.message),
    });
  }

  eliminarMedicamento(medicamento: Medicamento): void {
    if (!confirm(`¿Eliminar el medicamento "${medicamento.nombre}"?`)) return;
    this.error.set('');
    this.success.set('');
    this.historialService.eliminarMedicamento(this.idMascota, medicamento.id).subscribe({
      next: () => {
        this.success.set('Medicamento eliminado correctamente');
        if (this.medicamentoEditandoId() === medicamento.id) this.cancelarMedicamento();
        this.recargarHistorial();
      },
      error: (err) => this.error.set(err.message),
    });
  }
}
