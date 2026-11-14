import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { HistorialClinico, Medicamento, Vacuna } from '../core/models';

@Injectable({ providedIn: 'root' })
export class HistorialClinicoService {
  private readonly api = inject(ApiService);

  obtener(idMascota: number | string): Observable<HistorialClinico> {
    return this.api.get<HistorialClinico>(`/api/mascotas/${idMascota}/historial`);
  }

  actualizar(
    idMascota: number | string,
    data: { observaciones: string },
  ): Observable<HistorialClinico> {
    return this.api.put<HistorialClinico>(`/api/mascotas/${idMascota}/historial`, data);
  }

  registrarVacuna(idMascota: number | string, data: Record<string, unknown>): Observable<Vacuna> {
    return this.api.post<Vacuna>(`/api/mascotas/${idMascota}/historial/vacunas`, data);
  }

  actualizarVacuna(
    idMascota: number | string,
    idVacuna: number | string,
    data: Record<string, unknown>,
  ): Observable<Vacuna> {
    return this.api.put<Vacuna>(
      `/api/mascotas/${idMascota}/historial/vacunas/${idVacuna}`,
      data,
    );
  }

  eliminarVacuna(idMascota: number | string, idVacuna: number | string): Observable<void> {
    return this.api.delete<void>(`/api/mascotas/${idMascota}/historial/vacunas/${idVacuna}`);
  }

  registrarMedicamento(
    idMascota: number | string,
    data: Record<string, unknown>,
  ): Observable<Medicamento> {
    return this.api.post<Medicamento>(`/api/mascotas/${idMascota}/historial/medicamentos`, data);
  }

  actualizarMedicamento(
    idMascota: number | string,
    idMedicamento: number | string,
    data: Record<string, unknown>,
  ): Observable<Medicamento> {
    return this.api.put<Medicamento>(
      `/api/mascotas/${idMascota}/historial/medicamentos/${idMedicamento}`,
      data,
    );
  }

  eliminarMedicamento(idMascota: number | string, idMedicamento: number | string): Observable<void> {
    return this.api.delete<void>(
      `/api/mascotas/${idMascota}/historial/medicamentos/${idMedicamento}`,
    );
  }
}
