package com.example.PetCare.service;

import com.example.PetCare.dto.HistorialClinicoDTO;
import com.example.PetCare.dto.HistorialClinicoUpdateRequest;
import com.example.PetCare.dto.MedicamentoDTO;
import com.example.PetCare.dto.RegistroMedicamentoRequest;
import com.example.PetCare.dto.RegistroVacunaRequest;
import com.example.PetCare.dto.VacunaDTO;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.HistorialClinico;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Medicamento;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.model.Vacuna;
import com.example.PetCare.repository.HistorialClinicoRepository;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.MedicamentoRepository;
import com.example.PetCare.repository.VacunaRepository;
import com.example.PetCare.utils.AuthUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HistorialClinicoServiceTest {

    @Mock
    private HistorialClinicoRepository historialClinicoRepository;
    @Mock
    private MascotaRepository mascotaRepository;
    @Mock
    private VacunaRepository vacunaRepository;
    @Mock
    private MedicamentoRepository medicamentoRepository;
    @Mock
    private AuthUtils authUtils;

    @InjectMocks
    private HistorialClinicoService historialService;

    private Usuario cliente;
    private Usuario veterinario;
    private Mascota mascota;
    private HistorialClinico historial;
    private Vacuna vacuna;
    private Medicamento medicamento;

    @BeforeEach
    void setUp() {
        cliente = new Usuario();
        cliente.setIdUsuario(1);
        cliente.setNombre("Ana");
        cliente.setApellido("Gómez");
        cliente.setRol(Rol.CLIENTE);

        veterinario = new Usuario();
        veterinario.setIdUsuario(2);
        veterinario.setNombre("Juan");
        veterinario.setApellido("Pérez");
        veterinario.setRol(Rol.VETERINARIO);

        mascota = new Mascota();
        mascota.setIdMascota(10);
        mascota.setNombre("Firulais");
        mascota.setEspecie("PERRO");
        mascota.setUsuario(cliente);
        mascota.setActivo(true);

        historial = new HistorialClinico();
        historial.setId(3);
        historial.setFechaCreacion(LocalDate.now());
        historial.setActivo(true);
        historial.setMascota(mascota);

        vacuna = new Vacuna();
        vacuna.setId(11);
        vacuna.setNombre("Antirrábica");
        vacuna.setLote("L-100");
        vacuna.setFechaAplicacion(LocalDate.now().minusDays(30));
        vacuna.setFechaProximaDosis(LocalDate.now().plusYears(1));
        vacuna.setHistorialClinico(historial);
        vacuna.setUsuario(veterinario);

        medicamento = new Medicamento();
        medicamento.setId(21);
        medicamento.setNombre("Amoxicilina");
        medicamento.setDosis("250 mg");
        medicamento.setFrecuencia("Cada 12 horas");
        medicamento.setDuracion("7 días");
        medicamento.setFechaPrescripcion(LocalDate.now().minusDays(5));
        medicamento.setActivo(true);
        medicamento.setHistorialClinico(historial);
        medicamento.setUsuario(veterinario);
    }

    @Test
    @DisplayName("El veterinario actualiza las observaciones del historial")
    void actualizarHistorial() {
        when(authUtils.getCurrentUsuario()).thenReturn(veterinario);
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(historialClinicoRepository.findByMascota_IdMascota(10)).thenReturn(Optional.of(historial));
        when(historialClinicoRepository.save(any(HistorialClinico.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        HistorialClinicoDTO resultado = historialService.actualizarHistorial(
                10, new HistorialClinicoUpdateRequest("Control anual sin novedades"));

        assertEquals("Control anual sin novedades", resultado.getObservaciones());
        assertEquals(10, resultado.getIdMascota());
        verify(historialClinicoRepository).save(historial);
    }

    @Test
    @DisplayName("Si la mascota no tiene historial, se crea al guardar observaciones")
    void actualizarHistorialCreaSiNoExiste() {
        when(authUtils.getCurrentUsuario()).thenReturn(veterinario);
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(historialClinicoRepository.findByMascota_IdMascota(10)).thenReturn(Optional.empty());
        when(historialClinicoRepository.save(any(HistorialClinico.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        HistorialClinicoDTO resultado = historialService.actualizarHistorial(
                10, new HistorialClinicoUpdateRequest("Primera consulta"));

        assertEquals("Primera consulta", resultado.getObservaciones());
        assertNotNull(mascota.getHistorialClinico());
        verify(historialClinicoRepository, atLeast(2)).save(any(HistorialClinico.class));
    }

    @Test
    @DisplayName("Un cliente no puede editar el historial clínico")
    void clienteNoPuedeActualizarHistorial() {
        when(authUtils.getCurrentUsuario()).thenReturn(cliente);

        assertThrows(AccessDeniedException.class,
                () -> historialService.actualizarHistorial(10, new HistorialClinicoUpdateRequest("x")));
        verify(historialClinicoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Una mascota inactiva no permite editar el historial")
    void mascotaInactivaNoPermiteActualizar() {
        mascota.setActivo(false);
        when(authUtils.getCurrentUsuario()).thenReturn(veterinario);
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));

        assertThrows(NoEncontradoException.class,
                () -> historialService.actualizarHistorial(10, new HistorialClinicoUpdateRequest("x")));
        verify(historialClinicoRepository, never()).save(any());
    }

    @Test
    @DisplayName("El veterinario actualiza una vacuna de la mascota")
    void actualizarVacuna() {
        when(authUtils.getCurrentUsuario()).thenReturn(veterinario);
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(historialClinicoRepository.findByMascota_IdMascota(10)).thenReturn(Optional.of(historial));
        when(vacunaRepository.findByIdAndHistorialClinico_Id(11, 3)).thenReturn(Optional.of(vacuna));
        when(vacunaRepository.save(any(Vacuna.class))).thenAnswer(inv -> inv.getArgument(0));

        RegistroVacunaRequest request = new RegistroVacunaRequest();
        request.setNombre("Moquillo");
        request.setLote("L-200");
        request.setFechaAplicacion(LocalDate.now().minusDays(2));

        VacunaDTO resultado = historialService.actualizarVacuna(10, 11, request);

        assertEquals("Moquillo", resultado.getNombre());
        assertEquals("L-200", resultado.getLote());
        verify(vacunaRepository).save(vacuna);
    }

    @Test
    @DisplayName("No se puede editar una vacuna de otra mascota")
    void actualizarVacunaAjena() {
        when(authUtils.getCurrentUsuario()).thenReturn(veterinario);
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(historialClinicoRepository.findByMascota_IdMascota(10)).thenReturn(Optional.of(historial));
        when(vacunaRepository.findByIdAndHistorialClinico_Id(99, 3)).thenReturn(Optional.empty());

        assertThrows(NoEncontradoException.class,
                () -> historialService.actualizarVacuna(10, 99, new RegistroVacunaRequest()));
        verify(vacunaRepository, never()).save(any());
    }

    @Test
    @DisplayName("El veterinario elimina una vacuna de la mascota")
    void eliminarVacuna() {
        when(authUtils.getCurrentUsuario()).thenReturn(veterinario);
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(historialClinicoRepository.findByMascota_IdMascota(10)).thenReturn(Optional.of(historial));
        when(vacunaRepository.findByIdAndHistorialClinico_Id(11, 3)).thenReturn(Optional.of(vacuna));

        historialService.eliminarVacuna(10, 11);

        verify(vacunaRepository).delete(vacuna);
    }

    @Test
    @DisplayName("No se puede eliminar una vacuna de otra mascota")
    void eliminarVacunaAjena() {
        when(authUtils.getCurrentUsuario()).thenReturn(veterinario);
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(historialClinicoRepository.findByMascota_IdMascota(10)).thenReturn(Optional.of(historial));
        when(vacunaRepository.findByIdAndHistorialClinico_Id(99, 3)).thenReturn(Optional.empty());

        assertThrows(NoEncontradoException.class, () -> historialService.eliminarVacuna(10, 99));
        verify(vacunaRepository, never()).delete(any());
    }

    @Test
    @DisplayName("El veterinario actualiza un medicamento de la mascota")
    void actualizarMedicamento() {
        when(authUtils.getCurrentUsuario()).thenReturn(veterinario);
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(historialClinicoRepository.findByMascota_IdMascota(10)).thenReturn(Optional.of(historial));
        when(medicamentoRepository.findByIdAndHistorialClinico_Id(21, 3))
                .thenReturn(Optional.of(medicamento));
        when(medicamentoRepository.save(any(Medicamento.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        RegistroMedicamentoRequest request = new RegistroMedicamentoRequest();
        request.setNombre("Amoxicilina");
        request.setDosis("500 mg");
        request.setFrecuencia("Cada 8 horas");
        request.setDuracion("10 días");

        MedicamentoDTO resultado = historialService.actualizarMedicamento(10, 21, request);

        assertEquals("500 mg", resultado.getDosis());
        assertEquals("Cada 8 horas", resultado.getFrecuencia());
        verify(medicamentoRepository).save(medicamento);
    }

    @Test
    @DisplayName("No se puede editar un medicamento de otra mascota")
    void actualizarMedicamentoAjeno() {
        when(authUtils.getCurrentUsuario()).thenReturn(veterinario);
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(historialClinicoRepository.findByMascota_IdMascota(10)).thenReturn(Optional.of(historial));
        when(medicamentoRepository.findByIdAndHistorialClinico_Id(99, 3)).thenReturn(Optional.empty());

        assertThrows(NoEncontradoException.class,
                () -> historialService.actualizarMedicamento(10, 99, new RegistroMedicamentoRequest()));
        verify(medicamentoRepository, never()).save(any());
    }

    @Test
    @DisplayName("El veterinario elimina un medicamento de la mascota")
    void eliminarMedicamento() {
        when(authUtils.getCurrentUsuario()).thenReturn(veterinario);
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(historialClinicoRepository.findByMascota_IdMascota(10)).thenReturn(Optional.of(historial));
        when(medicamentoRepository.findByIdAndHistorialClinico_Id(21, 3))
                .thenReturn(Optional.of(medicamento));

        historialService.eliminarMedicamento(10, 21);

        verify(medicamentoRepository).delete(medicamento);
    }
}
