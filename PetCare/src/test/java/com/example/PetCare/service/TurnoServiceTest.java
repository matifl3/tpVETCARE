package com.example.PetCare.service;

import com.example.PetCare.dto.TurnoDTO;
import com.example.PetCare.enums.Estado_Turno;
import com.example.PetCare.enums.Rol;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.Turno;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.TurnoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TurnoServiceTest {

    @Mock
    private TurnoRepository turnoRepository;
    @Mock
    private MascotaRepository mascotaRepository;
    @Mock
    private ProfesionalRepository profesionalRepository;

    @InjectMocks
    private TurnoService turnoService;

    private final LocalDate fecha = LocalDate.now().plusDays(3);
    private Mascota mascota;
    private Profesional paseador;

    @BeforeEach
    void setUp() {
        mascota = new Mascota();
        mascota.setIdMascota(10);
        mascota.setNombre("Firulais");

        paseador = new Profesional();
        paseador.setIdUsuario(20);
        paseador.setNombre("Juan");
        paseador.setApellido("Pérez");
        paseador.setRol(Rol.PASEADOR);
    }

    private TurnoDTO pedido(Integer horas) {
        TurnoDTO dto = new TurnoDTO();
        dto.setId_mascota(10);
        dto.setId_profesional(20);
        dto.setFecha(fecha);
        dto.setHoras(horas);
        return dto;
    }

    @Test
    @DisplayName("Solicitar un turno lo confirma y calcula el precio por horas")
    void solicitarCalculaPrecio() {
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(profesionalRepository.findById(20)).thenReturn(Optional.of(paseador));
        when(turnoRepository.findByProfesionalIdUsuarioAndFechaAndActivoTrueAndEstadoTurno(20, fecha, Estado_Turno.CONFIRMADO))
                .thenReturn(List.of());
        when(turnoRepository.save(any(Turno.class))).thenAnswer(inv -> inv.getArgument(0));

        TurnoDTO resultado = turnoService.solicitar(pedido(3));

        // Paseador: 3000 de base + 1500 por cada hora extra → 3000 + 1500 * 2
        assertEquals(6000.0, resultado.getPrecio());
        assertEquals(Estado_Turno.CONFIRMADO, resultado.getEstadoTurno());
        assertTrue(resultado.getActivo());
        assertEquals("Juan Pérez", resultado.getNombreProfesional());
        assertEquals("Firulais", resultado.getNombreMascota());
    }

    @Test
    @DisplayName("Si no se mandan horas, el turno es de 1 hora")
    void solicitarSinHoras() {
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(profesionalRepository.findById(20)).thenReturn(Optional.of(paseador));
        when(turnoRepository.findByProfesionalIdUsuarioAndFechaAndActivoTrueAndEstadoTurno(20, fecha, Estado_Turno.CONFIRMADO))
                .thenReturn(List.of());
        when(turnoRepository.save(any(Turno.class))).thenAnswer(inv -> inv.getArgument(0));

        turnoService.solicitar(pedido(null));

        ArgumentCaptor<Turno> guardado = ArgumentCaptor.forClass(Turno.class);
        verify(turnoRepository).save(guardado.capture());
        assertEquals(1, guardado.getValue().getHoras());
        assertEquals(3000.0, guardado.getValue().getPrecio());
    }

    @Test
    @DisplayName("No se puede reservar si el profesional ya tiene un turno confirmado ese día")
    void solicitarSinDisponibilidad() {
        when(mascotaRepository.findById(10)).thenReturn(Optional.of(mascota));
        when(profesionalRepository.findById(20)).thenReturn(Optional.of(paseador));
        when(turnoRepository.findByProfesionalIdUsuarioAndFechaAndActivoTrueAndEstadoTurno(20, fecha, Estado_Turno.CONFIRMADO))
                .thenReturn(List.of(new Turno()));

        assertThrows(IllegalArgumentException.class, () -> turnoService.solicitar(pedido(1)));
        verify(turnoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Si la mascota no existe tira NoEncontradoException")
    void solicitarMascotaInexistente() {
        when(mascotaRepository.findById(10)).thenReturn(Optional.empty());

        assertThrows(NoEncontradoException.class, () -> turnoService.solicitar(pedido(1)));
        verify(turnoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Eliminar devuelve false si el turno no existe")
    void eliminarInexistente() {
        when(turnoRepository.existsById(99)).thenReturn(false);

        assertFalse(turnoService.eliminar(99));
        verify(turnoRepository, never()).deleteById(any());
    }
}
