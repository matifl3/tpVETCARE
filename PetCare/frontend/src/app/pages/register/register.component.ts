import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { AuthService } from '../../core/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

interface RegistroForm {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  rol: string;
  matricula: string;
  experiencia: string;
}

const ROLES_PROFESIONALES = ['VETERINARIO', 
  'PASEADOR', 
  'PELUQUERO', 
  'ADIESTRADOR', 
  'CUIDADOR'];

@Component({
  imports: [FormRoot, FormField, RouterLink],
  selector: 'app-register',
  styleUrl: './register.component.css',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  
  protected readonly rolesProfesionales = ROLES_PROFESIONALES;

  protected readonly formVacio : RegistroForm = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    rol: '',
    matricula: '',
    experiencia: ''
  }

  protected readonly formModel = signal({...this.formVacio});

  protected readonly camposProfesionales = computed(() =>
    ROLES_PROFESIONALES.includes(this.formModel().rol)
  );

  readonly formularioRegistro = form(
    this.formModel,
    (campos) => {
      required(campos.nombre, {message : 'Debe ingresar su nombre'});
      required(campos.apellido, {message : 'Debe ingresar su apellido'});
      required(campos.email, {message : 'Debe ingresar su mail'});
      required(campos.telefono, {message : 'Debe ingresar su numero de telefono'});
      required(campos.password, {message : 'Debe ingresar su contraseña'});
      required(campos.rol, {message : 'Debe elegir un rol'});
      required(campos.matricula, {message: 'Debe ingresar su matrícula',
        when: () => this.camposProfesionales(),
      });
      required(campos.experiencia, {message: 'Debe ingresar su experiencia',
        when: () => this.camposProfesionales(),
      });
    },{
      submission : {
        action : async (campos) => {
          const registro = campos().value();
          await firstValueFrom(this.auth.registro(registro));
          await this.router.navigate(['/login']);
        }
      }
    }
  )
}
