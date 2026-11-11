import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../core/models';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
    selector: 'app-admin-usuarios-page',
    imports: [RouterLink],
    templateUrl: './admin-usuarios-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './admin-usuarios-page.component.css'
})
export class AdminUsuariosPageComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);

  readonly usuarios = signal<Usuario[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly success = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  toggleActivo(user: Usuario): void {
    this.usuarioService.actualizar({ ...user, activo: !user.activo }).subscribe({
      next: () => {
        this.success.set(`Usuario ${user.email} ${user.activo ? 'desactivado' : 'activado'}`);
        this.cargar();
      },
      error: (err) => this.error.set(err.message),
    });
  }
}
