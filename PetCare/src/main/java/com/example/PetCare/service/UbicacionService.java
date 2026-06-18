package com.example.PetCare.service;

import com.example.PetCare.dto.UbicacionDTO;
import com.example.PetCare.enums.EstadoPaseo;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Paseo;
import com.example.PetCare.model.Ubicacion;
import com.example.PetCare.repository.PaseoRepository;
import com.example.PetCare.repository.UbicacionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UbicacionService {

    private final UbicacionRepository ubicacionRepository;
    private final PaseoRepository paseoRepository;
    private final PaseoWebSocketHandler webSocketHandler;

    public UbicacionService(UbicacionRepository ubicacionRepository,
                            PaseoRepository paseoRepository,
                            PaseoWebSocketHandler webSocketHandler) {
        this.ubicacionRepository = ubicacionRepository;
        this.paseoRepository = paseoRepository;
        this.webSocketHandler = webSocketHandler;
    }

    @Transactional
    public UbicacionDTO guardarUbicacion(Integer idPaseo, Double latitud, Double longitud, Integer idPaseador) {
        Paseo paseo = paseoRepository.findById(idPaseo)
                .orElseThrow(() -> new NoEncontradoException("Paseo no encontrado"));

        if (!paseo.getPaseador().getIdUsuario().equals(idPaseador)) {
            throw new RuntimeException("No autorizado para enviar ubicación de este paseo");
        }

        if (paseo.getEstado() != EstadoPaseo.EN_CURSO) {
            throw new RuntimeException("El paseo no está en curso");
        }

        Ubicacion ubicacion = new Ubicacion();
        ubicacion.setLatitud(latitud);
        ubicacion.setLongitud(longitud);
        ubicacion.setTimestamp(LocalDateTime.now());
        ubicacion.setPaseo(paseo);
        ubicacion = ubicacionRepository.save(ubicacion);

        UbicacionDTO dto = new UbicacionDTO(
                ubicacion.getLatitud(),
                ubicacion.getLongitud(),
                ubicacion.getTimestamp(),
                paseo.getEstado()
        );

        String json = String.format(
                "{\"latitud\":%f,\"longitud\":%f,\"timestamp\":\"%s\",\"estadoPaseo\":\"%s\"}",
                dto.getLatitud(), dto.getLongitud(), dto.getTimestamp().toString(), dto.getEstadoPaseo()
        );
        webSocketHandler.enviarUbicacion(idPaseo, json);

        return dto;
    }

    @Transactional
    public void notificarFinPaseo(Integer idPaseo) {
        Paseo paseo = paseoRepository.findById(idPaseo)
                .orElseThrow(() -> new NoEncontradoException("Paseo no encontrado"));

        String json = String.format(
                "{\"latitud\":null,\"longitud\":null,\"timestamp\":\"%s\",\"estadoPaseo\":\"%s\"}",
                LocalDateTime.now().toString(), EstadoPaseo.FINALIZADO
        );
        webSocketHandler.enviarUbicacion(idPaseo, json);
    }

    public List<Ubicacion> obtenerUbicaciones(Integer idPaseo) {
        return ubicacionRepository.findByPaseoIdPaseoOrderByTimestampAsc(idPaseo);
    }
}
