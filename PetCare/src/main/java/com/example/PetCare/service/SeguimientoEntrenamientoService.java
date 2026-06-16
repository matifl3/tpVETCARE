package com.example.PetCare.service;

import com.example.PetCare.dto.RegistroProgresoDTO;
import com.example.PetCare.dto.RegistroProgresoRequest;
import com.example.PetCare.dto.SeguimientoEntrenamientoDTO;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.*;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.RegistroProgresoRepository;
import com.example.PetCare.repository.SeguimientoEntrenamientoRepository;
import com.example.PetCare.utils.AuthUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class SeguimientoEntrenamientoService {

    private final SeguimientoEntrenamientoRepository seguimientoRepository;
    private final RegistroProgresoRepository registroProgresoRepository;
    private final MascotaRepository mascotaRepository;
    private final AuthUtils authUtils;

    public SeguimientoEntrenamientoService(SeguimientoEntrenamientoRepository seguimientoRepository,
                                           RegistroProgresoRepository registroProgresoRepository,
                                           MascotaRepository mascotaRepository,
                                           AuthUtils authUtils) {
        this.seguimientoRepository = seguimientoRepository;
        this.registroProgresoRepository = registroProgresoRepository;
        this.mascotaRepository = mascotaRepository;
        this.authUtils = authUtils;
    }

    // ==================== CONSULTAS ====================

    /**
     * Obtiene el seguimiento completo de adiestramiento de una mascota.
     * Valida que el usuario actual tenga permiso para verlo.
     *
     * Reglas de acceso:
     * - DUENIO: solo puede ver el seguimiento de sus propias mascotas
     * - ADIESTRADOR: puede ver el seguimiento de mascotas que tienen turno con él
     * - ADMIN: puede ver el seguimiento de cualquier mascota
     */
    public SeguimientoEntrenamientoDTO obtenerSeguimiento(int idMascota) {
        // Busca la mascota
        Mascota mascota = mascotaRepository.findById(idMascota)
                .orElseThrow(() -> new NoEncontradoException("Mascota no encontrada"));

        // Valida que el usuario actual tenga acceso
        validarAccesoSeguimiento(mascota);

        // Obtiene o crea el seguimiento (lazy creation)
        SeguimientoEntrenamiento seguimiento = obtenerOCrearSeguimiento(mascota);

        // Convierte a DTO
        return toDTO(seguimiento);
    }

    // ==================== CREAR REGISTRO ====================

    /**
     * Registra una nueva entrada de progreso en el adiestramiento.
     * Solo el ADIESTRADOR asignado o el ADMIN pueden crear registros.
     *
     * Si es la primera vez que el adiestrador registra algo para esta mascota,
     * se crea automáticamente el contenedor SeguimientoEntrenamiento.
     */
    public RegistroProgresoDTO registrarProgreso(int idMascota, RegistroProgresoRequest request) {
        // Obtiene el usuario actual (debe ser ADIESTRADOR o ADMIN)
        Usuario currentUser = authUtils.getCurrentUsuario();
        validarRolAdiestrador(currentUser);

        // Busca la mascota
        Mascota mascota = mascotaRepository.findById(idMascota)
                .orElseThrow(() -> new NoEncontradoException("Mascota no encontrada"));

        // Si es ADIESTRADOR, valida que tenga un turno con esta mascota
        if (currentUser.getRol() == Rol.ADIESTRADOR) {
            validarQueTengaTurnoConMascota(currentUser.getIdUsuario(), idMascota);
        }

        // Obtiene o crea el seguimiento (lazy creation)
        SeguimientoEntrenamiento seguimiento = obtenerOCrearSeguimiento(mascota);

        // Crea el registro de progreso
        RegistroProgreso registro = new RegistroProgreso();
        registro.setFecha(LocalDate.now());
        registro.setDescripcion(request.getDescripcion());
        registro.setTecnicas(request.getTecnicas());
        registro.setObservaciones(request.getObservaciones());
        registro.setEvaluacion(request.getEvaluacion());
        registro.setSeguimiento(seguimiento);
        registro.setProfesional((Profesional) currentUser);

        // Guarda y retorna como DTO
        RegistroProgreso guardado = registroProgresoRepository.save(registro);
        return toRegistroDTO(guardado);
    }

    // ==================== ACTUALIZAR REGISTRO ====================

    /**
     * Actualiza un registro de progreso existente.
     * Solo el adiestrador que lo creó o el ADMIN pueden editarlo.
     */
    public RegistroProgresoDTO actualizarRegistro(int idMascota, int idRegistro, RegistroProgresoRequest request) {
        // Obtiene el usuario actual
        Usuario currentUser = authUtils.getCurrentUsuario();

        // Busca el registro
        RegistroProgreso registro = registroProgresoRepository.findById(idRegistro)
                .orElseThrow(() -> new NoEncontradoException("Registro de progreso no encontrado"));

        // Valida que el registro pertenezca al seguimiento de la mascota correcta
        if (registro.getSeguimiento().getMascota().getIdMascota() != idMascota) {
            throw new NoEncontradoException("El registro no pertenece a esta mascota");
        }

        // Valida que solo el adiestrador que lo creó o el admin puedan editarlo
        if (currentUser.getRol() == Rol.ADIESTRADOR
                && !Objects.equals(registro.getProfesional().getIdUsuario(), currentUser.getIdUsuario())) {
            throw new AccessDeniedException("No tiene permiso para editar este registro");
        }

        // Actualiza los campos
        registro.setDescripcion(request.getDescripcion());
        registro.setTecnicas(request.getTecnicas());
        registro.setObservaciones(request.getObservaciones());
        registro.setEvaluacion(request.getEvaluacion());

        RegistroProgreso guardado = registroProgresoRepository.save(registro);
        return toRegistroDTO(guardado);
    }

    // ==================== ELIMINAR REGISTRO ====================

    /**
     * Elimina un registro de progreso.
     * Solo el ADMIN puede eliminar registros.
     */
    public void eliminarRegistro(int idMascota, int idRegistro) {
        // Obtiene el usuario actual
        Usuario currentUser = authUtils.getCurrentUsuario();

        // Solo ADMIN puede eliminar
        if (currentUser.getRol() != Rol.ADMIN) {
            throw new AccessDeniedException("Solo los administradores pueden eliminar registros");
        }

        // Busca el registro
        RegistroProgreso registro = registroProgresoRepository.findById(idRegistro)
                .orElseThrow(() -> new NoEncontradoException("Registro de progreso no encontrado"));

        // Valida que pertenezca a la mascota correcta
        if (registro.getSeguimiento().getMascota().getIdMascota() != idMascota) {
            throw new NoEncontradoException("El registro no pertenece a esta mascota");
        }

        registroProgresoRepository.delete(registro);
    }

    // ==================== MÉTODOS AUXILIARES DE VALIDACIÓN ====================

    /**
     * Valida que el usuario actual tenga acceso al seguimiento de la mascota.
     * DUENIO: solo sus propias mascotas.
     * ADIESTRADOR: mascotas con turno propio.
     * ADMIN: acceso total.
     */
    private void validarAccesoSeguimiento(Mascota mascota) {
        Usuario currentUser = authUtils.getCurrentUsuario();
        Rol rol = currentUser.getRol();

        // ADMIN tiene acceso a todo
        if (rol == Rol.ADMIN) {
            return;
        }

        // DUENIO solo puede ver el seguimiento de sus propias mascotas
        if (rol == Rol.DUENIO) {
            if (mascota.getUsuario() == null
                    || !Objects.equals(mascota.getUsuario().getIdUsuario(), currentUser.getIdUsuario())) {
                throw new NoEncontradoException("Mascota no encontrada");
            }
            return;
        }

        // ADIESTRADOR puede ver mascotas que tengan turno con él
        if (rol == Rol.ADIESTRADOR) {
            validarQueTengaTurnoConMascota(currentUser.getIdUsuario(), mascota.getIdMascota());
            return;
        }

        // Cualquier otro rol no tiene acceso
        throw new AccessDeniedException("No tiene permiso para ver el seguimiento de adiestramiento");
    }

    /**
     * Valida que el usuario actual tenga un turno confirmado con la mascota.
     * Esto asegura que solo los adiestradores que realmente están trabajando
     * con la mascota puedan ver/editar su seguimiento.
     */
    private void validarQueTengaTurnoConMascota(int idProfesional, int idMascota) {
        // Usa el repository de Mascota que ya tiene el query findMascotasAtendidasPorProfesional
        List<Mascota> mascotasAtendidas = mascotaRepository.findMascotasAtendidasPorProfesional(idProfesional);

        boolean tieneTurno = mascotasAtendidas.stream()
                .anyMatch(m -> m.getIdMascota() == idMascota);

        if (!tieneTurno) {
            throw new AccessDeniedException("No tiene turnos activos con esta mascota");
        }
    }

    /**
     * Valida que el usuario actual sea ADIESTRADOR o ADMIN.
     */
    private void validarRolAdiestrador(Usuario usuario) {
        if (usuario.getRol() != Rol.ADIESTRADOR && usuario.getRol() != Rol.ADMIN) {
            throw new AccessDeniedException("Solo los adiestradores o administradores pueden registrar progreso");
        }
    }

    // ==================== MÉTODO LAZY (CREACIÓN AUTOMÁTICA) ====================

    /**
     * Obtiene el seguimiento de adiestramiento de una mascota.
     * Si no existe, lo crea automáticamente (patrón lazy, igual que HistorialClinico).
     */
    private SeguimientoEntrenamiento obtenerOCrearSeguimiento(Mascota mascota) {
        return seguimientoRepository.findByMascota_IdMascota(mascota.getIdMascota())
                .orElseGet(() -> {
                    SeguimientoEntrenamiento nuevo = new SeguimientoEntrenamiento();
                    nuevo.setFechaCreacion(LocalDate.now());
                    nuevo.setActivo(true);
                    nuevo.setMascota(mascota);
                    return seguimientoRepository.save(nuevo);
                });
    }

    // ==================== CONVERSIONES A DTO ====================

    /**
     * Convierte la entidad SeguimientoEntrenamiento a su DTO.
     * Incluye todos los registros de progreso anidados.
     */
    private SeguimientoEntrenamientoDTO toDTO(SeguimientoEntrenamiento s) {
        SeguimientoEntrenamientoDTO dto = new SeguimientoEntrenamientoDTO();
        dto.setId(s.getId());
        dto.setFechaCreacion(s.getFechaCreacion());
        dto.setActivo(s.isActivo());
        dto.setIdMascota(s.getMascota().getIdMascota());
        dto.setNombreMascota(s.getMascota().getNombre());

        // Convierte cada registro de progreso a DTO
        List<RegistroProgresoDTO> registros = s.getRegistros().stream()
                .map(this::toRegistroDTO)
                .toList();
        dto.setRegistros(registros);

        return dto;
    }

    /**
     * Convierte un RegistroProgreso a su DTO.
     */
    private RegistroProgresoDTO toRegistroDTO(RegistroProgreso r) {
        RegistroProgresoDTO dto = new RegistroProgresoDTO();
        dto.setId(r.getId());
        dto.setFecha(r.getFecha());
        dto.setDescripcion(r.getDescripcion());
        dto.setTecnicas(r.getTecnicas());
        dto.setObservaciones(r.getObservaciones());
        dto.setEvaluacion(r.getEvaluacion());
        dto.setIdProfesional(r.getProfesional().getIdUsuario());
        dto.setNombreProfesional(r.getProfesional().getNombre() + " " + r.getProfesional().getApellido());
        return dto;
    }
}
