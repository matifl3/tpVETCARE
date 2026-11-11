package com.example.PetCare.config;

import com.example.PetCare.enums.EstadoProfesional;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Producto;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.ProductoRepository;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Carga datos de demostración al arrancar el backend: un admin, un cliente con mascotas,
 * profesionales aprobados y productos para la tienda.
 *
 * Es idempotente: solo inserta lo que falta (busca por email / nombre), así que se puede
 * arrancar el proyecto todas las veces que haga falta sin duplicar nada. Si borrás la base
 * entera, la próxima vez que arranque se vuelve a cargar todo.
 *
 * Se activa con la propiedad petcare.seed.enabled=true (application.properties).
 * En los tests no está activada, así arrancan con la base vacía.
 */
@Component
@ConditionalOnProperty(name = "petcare.seed.enabled", havingValue = "true")
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    /** Contraseña de todas las cuentas de demo. */
    private static final String PASSWORD_DEMO = "Demo1234";

    private final UsuarioRepository usuarioRepository;
    private final ProfesionalRepository profesionalRepository;
    private final MascotaRepository mascotaRepository;
    private final ProductoRepository productoRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UsuarioRepository usuarioRepository,
                      ProfesionalRepository profesionalRepository,
                      MascotaRepository mascotaRepository,
                      ProductoRepository productoRepository,
                      PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.profesionalRepository = profesionalRepository;
        this.mascotaRepository = mascotaRepository;
        this.productoRepository = productoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        int antes = (int) (usuarioRepository.count() + mascotaRepository.count() + productoRepository.count());

        crearUsuario("Admin", "PetCare", "admin@petcare.com", "1140000000", Rol.ADMIN);
        Usuario cliente = crearUsuario("Lucía", "Fernández", "cliente@petcare.com", "1141111111", Rol.CLIENTE);

        crearProfesionales();
        crearMascotas(cliente);
        crearProductos();

        int despues = (int) (usuarioRepository.count() + mascotaRepository.count() + productoRepository.count());
        log.info("DataSeeder: {} registros nuevos cargados (cuentas demo con contraseña '{}')",
                despues - antes, PASSWORD_DEMO);
    }

    // ---------------------------------------------------------------- usuarios

    private Usuario crearUsuario(String nombre, String apellido, String email, String telefono, Rol rol) {
        return usuarioRepository.findByEmail(email).orElseGet(() -> {
            Usuario u = new Usuario();
            u.setNombre(nombre);
            u.setApellido(apellido);
            u.setEmail(email);
            u.setTelefono(telefono);
            u.setDireccion("Av. Corrientes 1234, CABA");
            u.setPassword(passwordEncoder.encode(PASSWORD_DEMO));
            u.setRol(rol);
            u.setActivo(true);
            return usuarioRepository.save(u);
        });
    }

    private void crearProfesionales() {
        crearProfesional("Martín", "Gómez", "vet@petcare.com", "1142222222", Rol.VETERINARIO,
                "MV-10234", "12 años de experiencia en clínica de pequeños animales y cirugía general.");
        crearProfesional("Carolina", "Ruiz", "vet2@petcare.com", "1142222223", Rol.VETERINARIO,
                "MV-20871", "Especialista en felinos y medicina preventiva. 7 años de experiencia.");
        crearProfesional("Diego", "Sosa", "paseador@petcare.com", "1143333333", Rol.PASEADOR,
                "PAS-0451", "Paseos grupales e individuales en Palermo y Belgrano desde 2018.");
        crearProfesional("Valentina", "López", "peluquera@petcare.com", "1144444444", Rol.PELUQUERO,
                "PEL-0932", "Baño, corte de raza y deslanado. 5 años en peluquería canina.");
        crearProfesional("Federico", "Martínez", "adiestrador@petcare.com", "1145555555", Rol.ADIESTRADOR,
                "ADI-0218", "Adiestramiento en positivo, obediencia básica y corrección de conducta.");
        crearProfesional("Sofía", "Benítez", "cuidadora@petcare.com", "1146666666", Rol.CUIDADOR,
                "CUI-0777", "Cuidado a domicilio y guardería. Experiencia con perros mayores.");
    }

    private void crearProfesional(String nombre, String apellido, String email, String telefono, Rol rol,
                                  String matricula, String experiencia) {
        if (usuarioRepository.findByEmail(email).isPresent()) {
            return;
        }
        Profesional p = new Profesional();
        p.setNombre(nombre);
        p.setApellido(apellido);
        p.setEmail(email);
        p.setTelefono(telefono);
        p.setDireccion("CABA");
        p.setPassword(passwordEncoder.encode(PASSWORD_DEMO));
        p.setRol(rol);
        p.setMatricula(matricula);
        p.setExperiencia(experiencia);
        // Ya aprobados, para que aparezcan en la lista de profesionales sin pasar por el admin.
        p.setEstado(EstadoProfesional.APROBADO);
        p.setActivo(true);
        profesionalRepository.save(p);
    }

    // ---------------------------------------------------------------- mascotas

    private void crearMascotas(Usuario cliente) {
        // Si el cliente demo ya tiene mascotas, no se agregan más.
        if (!mascotaRepository.findByUsuario_IdUsuarioAndActivoTrue(cliente.getIdUsuario()).isEmpty()) {
            return;
        }
        crearMascota(cliente, "Toby", "PERRO", "Golden Retriever", "MACHO", 31.5,
                LocalDate.of(2020, 3, 14), "Vacunas al día. Alérgico al pollo.");
        crearMascota(cliente, "Luna", "GATO", "Siamés", "HEMBRA", 4.2,
                LocalDate.of(2021, 8, 2), "Castrada. Muy tranquila.");
        crearMascota(cliente, "Rocky", "PERRO", "Bulldog Francés", "MACHO", 12.8,
                LocalDate.of(2022, 11, 20), "Controlar respiración en días de calor.");
    }

    private void crearMascota(Usuario cliente, String nombre, String especie, String raza, String sexo,
                              double peso, LocalDate nacimiento, String observaciones) {
        Mascota m = new Mascota();
        m.setNombre(nombre);
        m.setEspecie(especie);
        m.setRaza(raza);
        m.setSexo(sexo);
        m.setPeso(peso);
        m.setFechaNacimiento(nacimiento);
        m.setObservaciones(observaciones);
        m.setActivo(true);
        m.setUsuario(cliente);
        mascotaRepository.save(m);
    }

    // ---------------------------------------------------------------- productos

    private void crearProductos() {
        crearProducto("Alimento Premium Perro Adulto 15kg", "Alimento balanceado para perros adultos de raza mediana y grande.", 42999.0, 25, "ALIMENTO");
        crearProducto("Alimento Gato Castrado 7.5kg", "Fórmula baja en grasas para gatos castrados.", 31500.0, 18, "ALIMENTO");
        crearProducto("Snacks Dentales x10", "Premios que ayudan a reducir el sarro.", 5900.0, 60, "ALIMENTO");
        crearProducto("Pelota de Goma Resistente", "Pelota maciza ideal para perros que muerden mucho.", 4500.0, 40, "JUGUETE");
        crearProducto("Ratón con Catnip", "Juguete de tela relleno con hierba gatera.", 2800.0, 50, "JUGUETE");
        crearProducto("Shampoo Neutro 500ml", "Shampoo hipoalergénico para perros y gatos.", 6200.0, 30, "HIGIENE");
        crearProducto("Piedras Sanitarias 4kg", "Arena aglomerante con control de olores.", 7800.0, 35, "HIGIENE");
        crearProducto("Collar Regulable con Chapita", "Collar de nylon con chapita grabable.", 8500.0, 20, "ACCESORIO");
        crearProducto("Correa Extensible 5m", "Correa retráctil con freno y traba.", 15900.0, 15, "ACCESORIO");
        crearProducto("Pipeta Antipulgas Perro 10-20kg", "Protección contra pulgas y garrapatas por 30 días.", 9900.0, 45, "SALUD");
        crearProducto("Antiparasitario Interno", "Comprimidos para perros y gatos. Caja x2.", 7400.0, 40, "SALUD");
        crearProducto("Buzo Polar Talle M", "Abrigo polar para perros medianos.", 12500.0, 12, "ROPA");
        crearProducto("Cama Acolchonada Mediana", "Cama lavable con base antideslizante.", 28900.0, 10, "CAMA");
        crearProducto("Transportadora Plástica Mediana", "Transportadora apta para viajes, hasta 12kg.", 36500.0, 8, "TRANSPORTE");
    }

    private void crearProducto(String nombre, String descripcion, double precio, int stock, String categoria) {
        if (!productoRepository.findByNombre(nombre).isEmpty()) {
            return;
        }
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setPrecio(precio);
        p.setStock(stock);
        p.setCategoria(categoria);
        p.setActivo(true);
        productoRepository.save(p);
    }
}
