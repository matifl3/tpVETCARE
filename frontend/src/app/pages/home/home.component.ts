import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Página pública de inicio. */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
