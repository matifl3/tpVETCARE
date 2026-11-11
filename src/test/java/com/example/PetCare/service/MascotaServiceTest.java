package com.example.PetCare.service;

import com.example.PetCare.dto.MascotaDTO;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MascotaServiceTest {

    @Mock
    private MascotaRepository mascotaRepository;
    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private MascotaService mascotaService;

    private Usuario cliente;
    private Mascota mascota;

    @BeforeEach
    void setUp() {
        cliente = new Usuario();
        cliente.setIdUsuario(1);
        cliente.setNombre("Ana");

        mascota = new Mascota();
        mascota.setIdMascota(10);
        mascota.setNombre("Firulais");
        mascota.setEspecie("PERRO");
        mascota.setUsuario(cliente);
        mascota.setActivo(true);
    }

    @Test
    @DisplayName("Una mascota nueva queda activa y asociada al cliente")
    void crearParaUsuario() {
        when(mascotaRepository.save(any(Mascota.class))).thenAnswer(inv -> inv.getArgument(0));
        MascotaDTO dto = new MascotaDTO();
        dto.setNombre("Michi");
        dto.setEspecie("GATO");

        mascotaService.crearParaUsuario(dto, cliente);

        ArgumentCaptor<Mascota> guardada = ArgumentCaptor.forClass(Mascota.class);
        verify(mascotaRepository).save(guardada.capture());
        assertTrue(guardada.getValue().isActivo());
        assertEquals(cliente, guardada.getValue().getUsuario());
        assertEquals("Michi", guardada.getValue().getNombre());
    }

    @Test
    @DisplayName("El dueño puede editar su mascota")
    void actualizarPropia() {
        when(mascotaRepository.findByIdMascotaAndUsuario_IdUsuario(10, 1)).thenReturn(Optional.of(mascota));
        when(mascotaRepository.save(any(Mascota.class))).thenAnswer(inv -> inv.getArgument(0));
        MascotaDTO cambios = new MascotaDTO();
        cambios.setNombre("Firu");
        cambios.setEspecie("PERRO");

        MascotaDTO resultado = mascotaService.actualizarParaUsuario(10, cambios, cliente);

        assertEquals("Firu", resultado.getNombre());
    }

    @Test
    @DisplayName("No se puede editar una mascota de otro usuario")
    void actualizarAjena() {
        when(mascotaRepository.findByIdMascotaAndUsuario_IdUsuario(10, 1)).thenReturn(Optional.empty());

        assertThrows(NoEncontradoException.class,
                () -> mascotaService.actualizarParaUsuario(10, new MascotaDTO(), cliente));
        verify(mascotaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Eliminar es una baja lógica: la mascota queda inactiva")
    void eliminarEsBajaLogica() {
        when(mascotaRepository.findByIdMascotaAndUsuario_IdUsuario(10, 1)).thenReturn(Optional.of(mascota));

        mascotaService.eliminarParaUsuario(10, cliente);

        assertFalse(mascota.isActivo());
        verify(mascotaRepository).save(mascota);
        verify(mascotaRepository, never()).delete(any());
    }
}
