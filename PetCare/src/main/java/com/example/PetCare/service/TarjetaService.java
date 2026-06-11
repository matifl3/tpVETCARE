package com.example.PetCare.service;

import com.example.PetCare.dto.TarjetaRequestDTO;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Tarjeta;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.TarjetaRepository;
import com.example.PetCare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class TarjetaService {
    private final TarjetaRepository tarjetaRepository;
    private final UsuarioRepository usuarioRepository;

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

    private String obtenerUltimosDigitos(String numeroTarjeta){
        return numeroTarjeta.substring(numeroTarjeta.length() - 4);
    }

    private void validarVencimiento(String vencimiento){
        YearMonth vencimientoYM = YearMonth.parse(vencimiento, DateTimeFormatter.ofPattern("MM/yy"));
        if (vencimientoYM.isBefore(YearMonth.now())) {
            throw new IllegalArgumentException("La tarjeta está vencida");
        }
    }
}
