import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

interface LoginForm {
  email: string;
  password: string;
}


@Component({
    selector: 'app-login',
    imports: [RouterLink, FormField, FormRoot],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly error = signal('');

  protected readonly formVacio : LoginForm = {
    email: '',
    password: ''
  }

  protected readonly formModel = signal({...this.formVacio});

  readonly formularioLogin = form(
    this.formModel,
    (campos) => {
      required(campos.email, {message : 'Debe ingresar un mail'});
      required(campos.password, {message : 'Debe ingresar su contraseña'});
    },{
      submission : {
        action : async (campos) => {
          const mail = campos().value().email;
          const contraseña = campos().value().password;
          await firstValueFrom(this.auth.login(mail, contraseña));
        }
      }
    }
  )
}
