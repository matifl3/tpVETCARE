package com.example.PetCare.service;

import com.example.PetCare.dto.PaseoDTO;
import com.example.PetCare.dto.PaseoRequestDTO;
import com.example.PetCare.enums.EstadoPaseo;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Paseo;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.Turno;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.PaseoRepository;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.TurnoRepository;
import com.example.PetCare.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaseoService {

    private final PaseoRepository paseoRepository;
    private final ProfesionalRepository profesionalRepository;
    private final MascotaRepository mascotaRepository;
    private final UsuarioRepository usuarioRepository;
    private final TurnoRepository turnoRepository;

    public PaseoService(PaseoRepository paseoRepository,
                        ProfesionalRepository profesionalRepository,
                        MascotaRepository mascotaRepository,
                        UsuarioRepository usuarioRepository,
                        TurnoRepository turnoRepository) {
        this.paseoRepository = paseoRepository;
        this.profesionalRepository = profesionalRepository;
        this.mascotaRepository = mascotaRepository;
        this.usuarioRepository = usuarioRepository;
        this.turnoRepository = turnoRepository;
    }

    @Transactional
    public PaseoDTO iniciarPaseo(Integer idPaseador, PaseoRequestDTO request) {
        Profesional paseador = profesionalRepository.findById(idPaseador)
                .orElseThrow(() -> new NoEncontradoException("Paseador no encontrado"));

        Mascota mascota = mascotaRepository.findById(request.getIdMascota())
                .orElseThrow(() -> new NoEncontradoException("Mascota no encontrada"));

        Usuario cliente = usuarioRepository.findById(request.getIdCliente())
                .orElseThrow(() -> new NoEncontradoException("Cliente no encontrado"));

        Paseo paseo = new Paseo();
        paseo.setFechaInicio(LocalDateTime.now());
        paseo.setEstado(EstadoPaseo.EN_CURSO);
        paseo.setActivo(true);
        paseo.setPaseador(paseador);
        paseo.setMascota(mascota);
        paseo.setCliente(cliente);

        paseo = paseoRepository.save(paseo);
        return toDTO(paseo);
    }

    @Transactional
    public PaseoDTO iniciarPaseoDesdeTurno(Integer idPaseador, Integer idTurno) {
        Turno turno = turnoRepository.findById(idTurno)
                .orElseThrow(() -> new NoEncontradoException("Turno no encontrado"));

        if (!turno.getProfesional().getIdUsuario().equals(idPaseador)) {
            throw new RuntimeException("No autorizado para iniciar paseo de este turno");
        }

        Profesional paseador = turno.getProfesional();
        Mascota mascota = turno.getMascota();
        Usuario cliente = mascota.getUsuario();

        Paseo paseo = new Paseo();
        paseo.setFechaInicio(LocalDateTime.now());
        paseo.setEstado(EstadoPaseo.EN_CURSO);
        paseo.setActivo(true);
        paseo.setPaseador(paseador);
        paseo.setMascota(mascota);
        paseo.setCliente(cliente);

        paseo = paseoRepository.save(paseo);
        return toDTO(paseo);
    }

    @Transactional
    public PaseoDTO finalizarPaseo(Integer idPaseo, Integer idPaseador) {
        Paseo paseo = paseoRepository.findById(idPaseo)
                .orElseThrow(() -> new NoEncontradoException("Paseo no encontrado"));

        if (!paseo.getPaseador().getIdUsuario().equals(idPaseador)) {
            throw new RuntimeException("No autorizado para finalizar este paseo");
        }

        paseo.setFechaFin(LocalDateTime.now());
        paseo.setEstado(EstadoPaseo.FINALIZADO);
        paseo = paseoRepository.save(paseo);
        return toDTO(paseo);
    }

    public PaseoDTO obtenerPorId(Integer idPaseo) {
        Paseo paseo = paseoRepository.findById(idPaseo)
                .orElseThrow(() -> new NoEncontradoException("Paseo no encontrado"));
        return toDTO(paseo);
    }

    public List<PaseoDTO> obtenerPaseosActivosDelPaseador(Integer idPaseador) {
        return paseoRepository.findByPaseadorIdUsuarioAndEstadoAndActivoTrue(idPaseador, EstadoPaseo.EN_CURSO)
                .stream().map(this::toDTO).toList();
    }

    public List<PaseoDTO> obtenerPaseosDelCliente(Integer idCliente) {
        return paseoRepository.findByClienteIdUsuarioAndActivoTrue(idCliente)
                .stream().map(this::toDTO).toList();
    }

    public PaseoDTO toDTO(Paseo paseo) {
        return new PaseoDTO(
                paseo.getIdPaseo(),
                paseo.getFechaInicio(),
                paseo.getFechaFin(),
                paseo.getEstado(),
                paseo.getPaseador().getIdUsuario(),
                paseo.getPaseador().getNombre(),
                paseo.getCliente().getIdUsuario(),
                paseo.getCliente().getNombre(),
                paseo.getMascota().getIdMascota(),
                paseo.getMascota().getNombre()
        );
    }
}
