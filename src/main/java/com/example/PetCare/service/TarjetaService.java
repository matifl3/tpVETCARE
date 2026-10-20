package com.example.PetCare.service;

import com.example.PetCare.dto.CompraRequestDTO;
import com.example.PetCare.dto.TarjetaDTO;
import com.example.PetCare.dto.TarjetaRequestDTO;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Tarjeta;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.TarjetaRepository;
import com.example.PetCare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TarjetaService {
    private final TarjetaRepository tarjetaRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Verifica la fecha de vencimiento ingresada.
     * Solamente quedan guardados los ultimos cuatro digitos.
     */
    public Tarjeta agregarTarjeta(TarjetaRequestDTO dto){
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new NoEncontradoException("Usuario no encontrado"));
        validarVencimiento(dto.getVencimiento());
        String ultimosDigitos = obtenerUltimosDigitos(dto.getNumeroTarjeta());
        Tarjeta tarjeta = new Tarjeta();
        tarjeta.setUsuario(usuario);
        tarjeta.setTitular(dto.getTitular());
        tarjeta.setVencimiento(dto.getVencimiento());
        tarjeta.setUltimosDigitos(ultimosDigitos);
        tarjeta.setActivo(true);
        return tarjetaRepository.save(tarjeta);
    }

    /**
     * Devuelve una lista de todas las tarjetas activas del usuario activo.
     */
    public List<TarjetaDTO> listarTarjetas(Integer idUsuario){
        return tarjetaRepository.findByUsuarioIdUsuarioAndActivoTrue(idUsuario)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    /**
     * Verifica que la tarjeta exista y pertenezca al usuario y la devuelve.
     */
    public TarjetaDTO obtenerTarjeta(Integer idTarjeta, Integer idUsuario){
        Tarjeta tarjeta = tarjetaRepository.findById(idTarjeta)
                .orElseThrow(() -> new NoEncontradoException("Tarjeta no encontrada"));
        if(!tarjeta.getUsuario().getIdUsuario().equals(idUsuario)){
            throw new IllegalArgumentException("La tarjeta no pertenece al usuario");
        }
        return toDTO(tarjeta);
    }

    /**
     * Verifica que la tarjeta exista y pertenezca al usuario. La desactiva y persiste los cambios.
     */
    public void eliminarTarjeta(Integer idTarjeta, Integer idUsuario){
        Tarjeta tarjeta = tarjetaRepository.findById(idTarjeta)
                .orElseThrow(() -> new NoEncontradoException("Tarjeta no encontrada"));
        if(!tarjeta.getUsuario().getIdUsuario().equals(idUsuario)){
            throw new IllegalArgumentException("La tarjeta no pertenece al usuario");
        }
        tarjeta.setActivo(false);
        tarjetaRepository.save(tarjeta);
    }

    /**
     * Recibe el numero completo de la tarjeta y devuelve unicamente los ultimos cuatro digitos.
     */
    private String obtenerUltimosDigitos(String numeroTarjeta){
        return numeroTarjeta.substring(numeroTarjeta.length() - 4);
    }

    /**
     * Convierte la fecha de vencimiento a un formaro de fecha y verifica que no este vencido.
     */
    private void validarVencimiento(String vencimiento){
        YearMonth vencimientoYM = YearMonth.parse(vencimiento, DateTimeFormatter.ofPattern("MM/yy"));
        if (vencimientoYM.isBefore(YearMonth.now())) {
            throw new IllegalArgumentException("La tarjeta está vencida");
        }
    }

    /**
     * Verifica que la tarjeta seleccionada exista, pertenezca al usuario autenticado
     * y se encuentre activa.
     */
    public void validarTarjetaParaPago(Integer idTarjeta, Integer idUsuario){
        Tarjeta tarjeta = tarjetaRepository.findById(idTarjeta)
                .orElseThrow(() -> new NoEncontradoException("Tarjeta no encontrada"));

        if(!tarjeta.getUsuario().getIdUsuario().equals(idUsuario)){
            throw new IllegalArgumentException("La tarjeta no pertenece al usuario");
        }

        if(!tarjeta.isActivo()){
            throw new IllegalArgumentException("La tarjeta no esta activa");
        }
    }

    /**
     * Resuelve el pago con tarjeta según la información proporcionada.
     * Si se indica una tarjeta guardada, valida que exista, pertenezca al usuario y esté activa.
     * Si se indica una tarjeta nueva, la registra y valida antes de proceder.
     * Si no se proporciona ninguna de las dos, lanza una excepción.
     */
    public void resolverPagoConTarjeta(CompraRequestDTO dto){
        if(dto.getIdTarjetaGuardada() != null){
            validarTarjetaParaPago(dto.getIdTarjetaGuardada(), dto.getId_usuario());
        }else if(dto.getTarjetaNueva() != null){
            dto.getTarjetaNueva().setIdUsuario(dto.getId_usuario());
            agregarTarjeta(dto.getTarjetaNueva());
        }else{
            throw new IllegalArgumentException("Debe seleccionar o ingresar una tarjeta");
        }
    }

    private TarjetaDTO toDTO(Tarjeta tarjeta) {
        TarjetaDTO dto = new TarjetaDTO();
        dto.setIdTarjeta(tarjeta.getId());
        dto.setTitular(tarjeta.getTitular());
        dto.setUltimosDigitos(tarjeta.getUltimosDigitos());
        dto.setVencimiento(tarjeta.getVencimiento());
        dto.setActivo(tarjeta.isActivo());
        return dto;
    }
}
