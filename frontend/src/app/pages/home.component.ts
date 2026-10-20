import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Página pública de inicio. */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <nav class="navbar">
        <div class="container">
          <a routerLink="/" class="logo">
            <span class="logo-icon">🐾</span>
            <h1>PetCare</h1>
          </a>
          <div class="nav-links">
            <a href="#servicios">Servicios</a>
            <a href="#trabaja">Trabajá con nosotros</a>
            <a routerLink="/login" class="btn-primary">Ingresar</a>
          </div>
        </div>
      </nav>

      <section class="hero" id="hero">
        <div class="container">
          <div class="hero-content">
            <div class="hero-badge">🐶 Cuidado integral</div>
            <h1>El mejor cuidado para <span>tu mejor amigo</span></h1>
            <p>
              En PetCare ofrecemos servicios completos de veterinaria, paseo, peluquería,
              adiestramiento y cuidado para que tu mascota reciba todo el amor y la atención
              que merece. Contamos con profesionales capacitados y apasionados por los animales.
            </p>
            <div class="hero-buttons">
              <a routerLink="/login" class="btn-primary">Comenzar ahora</a>
              <a href="#servicios" class="btn-secondary">Conocé nuestros servicios</a>
            </div>
          </div>
          <div class="hero-image">
            <div class="hero-illustration">🐾</div>
          </div>
        </div>
      </section>

      <section id="servicios">
        <div class="container">
          <h2 class="section-title">Nuestros Servicios</h2>
          <p class="section-subtitle">
            Ofrecemos una amplia gama de servicios para el bienestar de tu mascota,
            con profesionales capacitados y dedicados.
          </p>
          <div class="services-grid">
            <div class="service-card">
              <span class="service-icon">👨‍⚕️</span>
              <h3>Veterinaria</h3>
              <p>Atención clínica general, vacunación, análisis y cirugías menores.</p>
            </div>
            <div class="service-card">
              <span class="service-icon">🐕</span>
              <h3>Paseo</h3>
              <p>Paseos diarios supervisados para que tu perro haga ejercicio y se divierta.</p>
            </div>
            <div class="service-card">
              <span class="service-icon">✂️</span>
              <h3>Peluquería</h3>
              <p>Corte, baño, cepillado y cuidados estéticos para todo tipo de mascotas.</p>
            </div>
            <div class="service-card">
              <span class="service-icon">🎯</span>
              <h3>Adiestramiento</h3>
              <p>Entrenamiento profesional en obediencia básica, avanzada y modificación de conducta.</p>
            </div>
            <div class="service-card">
              <span class="service-icon">🏠</span>
              <h3>Cuidado</h3>
              <p>Hospedaje y cuidado temporal en un ambiente seguro y afectuoso.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="trabaja">
        <div class="container">
          <h2 class="section-title">Trabajá con nosotros</h2>
          <p class="section-subtitle">
            Somos una red en crecimiento y buscamos profesionales comprometidos
            para sumarse a PetCare. Si te apasiona el cuidado animal, ¡te esperamos!
          </p>
          <div class="profesiones-grid">
            <div class="profesion-card">
              <span class="profesion-icon">👨‍⚕️</span>
              <span>Veterinario</span>
            </div>
            <div class="profesion-card">
              <span class="profesion-icon">🐕</span>
              <span>Paseador</span>
            </div>
            <div class="profesion-card">
              <span class="profesion-icon">✂️</span>
              <span>Peluquero</span>
            </div>
            <div class="profesion-card">
              <span class="profesion-icon">🎯</span>
              <span>Adiestrador</span>
            </div>
            <div class="profesion-card">
              <span class="profesion-icon">🏠</span>
              <span>Cuidador</span>
            </div>
          </div>
          <p>
            Registrate como profesional y un administrador revisará tu solicitud.
            Si tu perfil es seleccionado, te contactaremos a la brevedad.
          </p>
          <br />
          <a routerLink="/login" class="btn-primary">Registrate ahora</a>
        </div>
      </section>

      <footer class="footer">
        <div class="container">
          <p>&copy; 2026 PetCare. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `,
})
export class HomeComponent {}
