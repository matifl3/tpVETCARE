import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-icon">🐾</span>
            <h1>PetCare</h1>
          </Link>
          <div className="nav-links">
            <a href="#servicios">Servicios</a>
            <a href="#trabaja">Trabajá con nosotros</a>
            <Link to="/login" className="btn-primary">Ingresar</Link>
          </div>
        </div>
      </nav>

      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">🐶 Cuidado integral</div>
            <h1>El mejor cuidado para <span>tu mejor amigo</span></h1>
            <p>
              En PetCare ofrecemos servicios completos de veterinaria, paseo, peluquería,
              adiestramiento y cuidado para que tu mascota reciba todo el amor y la atención
              que merece. Contamos con profesionales capacitados y apasionados por los animales.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="btn-primary">Comenzar ahora</Link>
              <a href="#servicios" className="btn-secondary">Conocé nuestros servicios</a>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">🐾</div>
          </div>
        </div>
      </section>

      <section id="servicios">
        <div className="container">
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-subtitle">
            Ofrecemos una amplia gama de servicios para el bienestar de tu mascota,
            con profesionales capacitados y dedicados.
          </p>
          <div className="services-grid">
            <div className="service-card">
              <span className="service-icon">👨‍⚕️</span>
              <h3>Veterinaria</h3>
              <p>Atención clínica general, vacunación, análisis y cirugías menores.</p>
            </div>
            <div className="service-card">
              <span className="service-icon">🐕</span>
              <h3>Paseo</h3>
              <p>Paseos diarios supervisados para que tu perro haga ejercicio y se divierta.</p>
            </div>
            <div className="service-card">
              <span className="service-icon">✂️</span>
              <h3>Peluquería</h3>
              <p>Corte, baño, cepillado y cuidados estéticos para todo tipo de mascotas.</p>
            </div>
            <div className="service-card">
              <span className="service-icon">🎯</span>
              <h3>Adiestramiento</h3>
              <p>Entrenamiento profesional en obediencia básica, avanzada y modificación de conducta.</p>
            </div>
            <div className="service-card">
              <span className="service-icon">🏠</span>
              <h3>Cuidado</h3>
              <p>Hospedaje y cuidado temporal en un ambiente seguro y afectuoso.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="trabaja">
        <div className="container">
          <h2 className="section-title">Trabajá con nosotros</h2>
          <p className="section-subtitle">
            Somos una red en crecimiento y buscamos profesionales comprometidos
            para sumarse a PetCare. Si te apasiona el cuidado animal, ¡te esperamos!
          </p>
          <div className="profesiones-grid">
            <div className="profesion-card">
              <span className="profesion-icon">👨‍⚕️</span>
              <span>Veterinario</span>
            </div>
            <div className="profesion-card">
              <span className="profesion-icon">🐕</span>
              <span>Paseador</span>
            </div>
            <div className="profesion-card">
              <span className="profesion-icon">✂️</span>
              <span>Peluquero</span>
            </div>
            <div className="profesion-card">
              <span className="profesion-icon">🎯</span>
              <span>Adiestrador</span>
            </div>
            <div className="profesion-card">
              <span className="profesion-icon">🏠</span>
              <span>Cuidador</span>
            </div>
          </div>
          <p>
            Registrate como profesional y un administrador revisará tu solicitud.
            Si tu perfil es seleccionado, te contactaremos a la brevedad.
          </p>
          <br />
          <Link to="/login" className="btn-primary">Registrate ahora</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 PetCare. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
