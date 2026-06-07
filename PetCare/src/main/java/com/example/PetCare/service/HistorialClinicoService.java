package com.example.PetCare.service;

import com.example.PetCare.dto.*;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.*;
import com.example.PetCare.repository.*;
import com.example.PetCare.utils.AuthUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
public class HistorialClinicoService {

    private final HistorialClinicoRepository historialClinicoRepository;
    private final MascotaRepository mascotaRepository;
    private final VacunaRepository vacunaRepository;
    private final MedicamentoRepository medicamentoRepository;
    private final AuthUtils authUtils;

    public HistorialClinicoService(HistorialClinicoRepository historialClinicoRepository,
                                   MascotaRepository mascotaRepository,
                                   VacunaRepository vacunaRepository,
                                   MedicamentoRepository medicamentoRepository,
                                   AuthUtils authUtils) {
        this.historialClinicoRepository = historialClinicoRepository;
        this.mascotaRepository = mascotaRepository;
        this.vacunaRepository = vacunaRepository;
        this.medicamentoRepository = medicamentoRepository;
        this.authUtils = authUtils;
    }

    public HistorialClinicoDTO obtenerHistorial(int idMascota) {
        Mascota mascota = mascotaRepository.findById(idMascota)
                .orElseThrow(() -> new NoEncontradoException("Mascota no encontrada"));

        validarAccesoMascota(mascota);

        HistorialClinico historial = obtenerOCrearHistorial(mascota);
        return toDTO(historial);
    }

    public VacunaDTO registrarVacuna(int idMascota, RegistroVacunaRequest request) {
        Usuario profesional = authUtils.getCurrentUsuario();
        validarRolVeterinario(profesional);

        Mascota mascota = mascotaRepository.findById(idMascota)
                .orElseThrow(() -> new NoEncontradoException("Mascota no encontrada"));

        HistorialClinico historial = obtenerOCrearHistorial(mascota);

        Vacuna vacuna = new Vacuna();
        vacuna.setNombre(request.getNombre());
        vacuna.setFechaAplicacion(request.getFechaAplicacion() != null ? request.getFechaAplicacion() : LocalDate.now());
        vacuna.setFechaProximaDosis(request.getFechaProximaDosis());
        vacuna.setLote(request.getLote());
        vacuna.setObservaciones(request.getObservaciones());
        vacuna.setHistorialClinico(historial);
        vacuna.setProfesional(profesional);

        return toVacunaDTO(vacunaRepository.save(vacuna));
    }

    public MedicamentoDTO registrarMedicamento(int idMascota, RegistroMedicamentoRequest request) {
        Usuario profesional = authUtils.getCurrentUsuario();
        validarRolVeterinario(profesional);

        Mascota mascota = mascotaRepository.findById(idMascota)
                .orElseThrow(() -> new NoEncontradoException("Mascota no encontrada"));

        HistorialClinico historial = obtenerOCrearHistorial(mascota);

        Medicamento medicamento = new Medicamento();
        medicamento.setNombre(request.getNombre());
        medicamento.setDosis(request.getDosis());
        medicamento.setFrecuencia(request.getFrecuencia());
        medicamento.setDuracion(request.getDuracion());
        medicamento.setFechaPrescripcion(request.getFechaPrescripcion() != null ? request.getFechaPrescripcion() : LocalDate.now());
        medicamento.setIndicaciones(request.getIndicaciones());
        medicamento.setActivo(true);
        medicamento.setHistorialClinico(historial);
        medicamento.setProfesional(profesional);

        return toMedicamentoDTO(medicamentoRepository.save(medicamento));
    }

    private void validarAccesoMascota(Mascota mascota) {
        Usuario currentUser = authUtils.getCurrentUsuario();
        Rol rol = currentUser.getRol();

        if (rol == Rol.DUENIO) {
            if (mascota.getUsuario() == null
                    || !Objects.equals(mascota.getUsuario().getIdUsuario(), currentUser.getIdUsuario())) {
                throw new NoEncontradoException("Mascota no encontrada");
            }
        } else if (rol != Rol.VETERINARIO && rol != Rol.ADMIN) {
            throw new AccessDeniedException("No tiene permiso para acceder al historial clínico");
        }

        if (!mascota.isActivo()) {
            throw new NoEncontradoException("Mascota no encontrada");
        }
    }

    private void validarRolVeterinario(Usuario usuario) {
        Rol rol = usuario.getRol();
        if (rol != Rol.VETERINARIO && rol != Rol.ADMIN) {
            throw new AccessDeniedException("Solo veterinarios o administradores pueden registrar vacunas y medicamentos");
        }
    }

    private HistorialClinico obtenerOCrearHistorial(Mascota mascota) {
        return historialClinicoRepository.findByMascota_IdMascota(mascota.getIdMascota())
                .orElseGet(() -> {
                    HistorialClinico nuevo = new HistorialClinico();
                    nuevo.setFechaCreacion(LocalDate.now());
                    nuevo.setActivo(true);
                    nuevo.setMascota(mascota);
                    return historialClinicoRepository.save(nuevo);
                });
    }

    public HistorialClinicoDTO toDTO(HistorialClinico h) {
        List<VacunaDTO> vacunas = h.getVacunas().stream()
                .map(this::toVacunaDTO)
                .toList();

        List<MedicamentoDTO> medicamentos = h.getMedicamentos().stream()
                .map(this::toMedicamentoDTO)
                .toList();

        return new HistorialClinicoDTO(
                h.getId(),
                h.getFechaCreacion(),
                h.isActivo(),
                h.getObservaciones(),
                h.getMascota() != null ? h.getMascota().getIdMascota() : 0,
                h.getMascota() != null ? h.getMascota().getNombre() : null,
                vacunas,
                medicamentos
        );
    }

    public VacunaDTO toVacunaDTO(Vacuna v) {
        return new VacunaDTO(
                v.getId(),
                v.getNombre(),
                v.getFechaAplicacion(),
                v.getFechaProximaDosis(),
                v.getLote(),
                v.getObservaciones(),
                v.getProfesional() != null ? v.getProfesional().getIdUsuario() : 0,
                v.getProfesional() != null
                        ? v.getProfesional().getNombre() + " " + v.getProfesional().getApellido()
                        : null
        );
    }

    public MedicamentoDTO toMedicamentoDTO(Medicamento m) {
        return new MedicamentoDTO(
                m.getId(),
                m.getNombre(),
                m.getDosis(),
                m.getFrecuencia(),
                m.getDuracion(),
                m.getFechaPrescripcion(),
                m.getIndicaciones(),
                m.isActivo(),
                m.getProfesional() != null ? m.getProfesional().getIdUsuario() : 0,
                m.getProfesional() != null
                        ? m.getProfesional().getNombre() + " " + m.getProfesional().getApellido()
                        : null
        );
    }
}
