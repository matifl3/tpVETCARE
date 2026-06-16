package com.example.PetCare.service;

import com.example.PetCare.dto.RecordatorioDTO;
import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Mascota;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.model.Recordatorio;
import com.example.PetCare.model.Usuario;
import com.example.PetCare.repository.MascotaRepository;
import com.example.PetCare.repository.ProfesionalRepository;
import com.example.PetCare.repository.RecordatorioRepository;
import com.example.PetCare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecordatorioService {
    private final RecordatorioRepository recordatorioRepository;
    private final UsuarioRepository usuarioRepository;
    private final MascotaRepository mascotaRepository;
    private final ProfesionalRepository profesionalRepository;

    public RecordatorioDTO crearRecordatorio(RecordatorioDTO dto){
        Usuario duenio = usuarioRepository.findById(dto.getIdDuenio())
                .orElseThrow(() -> new NoEncontradoException("Dueño no encontrado"));
        Profesional veterinario = profesionalRepository.findById(dto.getIdVeterinario())
                .orElseThrow(() -> new NoEncontradoException("Veterinario no encontrado"));
        Mascota mascota = mascotaRepository.findById(dto.getIdMascota())
                .orElseThrow(() -> new NoEncontradoException("Mascota no encontrada"));

        Recordatorio recordatorio = new Recordatorio();
        recordatorio.setVeterinario(veterinario);
        recordatorio.setDuenio(duenio);
        recordatorio.setMascota(mascota);
        recordatorio.setTitulo(dto.getTitulo());
        recordatorio.setDescripcion(dto.getDescripcion());
        recordatorio.setFechaHora(dto.getFechaHora());
        recordatorio.setFechaCreacion(LocalDate.now());
        return toDTO(recordatorioRepository.save(recordatorio));
    }

    public List<RecordatorioDTO> listarPorDuenio(Integer idDuenio){
        return recordatorioRepository.findByDuenioIdUsuario(idDuenio)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<RecordatorioDTO> listarPorVeterinario(Integer idVeterinario){
        return recordatorioRepository.findByDuenioIdUsuario(idVeterinario)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public RecordatorioDTO modificarRecordatorio(Integer idRecordatorio, Integer idVeterinario, RecordatorioDTO dto){
        Recordatorio recordatorio = recordatorioRepository.findById(idRecordatorio)
                .orElseThrow(() -> new NoEncontradoException("Recordatorio no encontrado"));
        if(!recordatorio.getVeterinario().getIdUsuario().equals(idVeterinario)){
            throw new IllegalArgumentException("Solo el veterinario puede modificar este recordatorio");
        }

        Mascota mascota = mascotaRepository.findById(dto.getIdMascota())
                .orElseThrow(() ->  new NoEncontradoException("Mascota no encontrada"));

        recordatorio.setTitulo(dto.getTitulo());
        recordatorio.setDescripcion(dto.getDescripcion());
        recordatorio.setFechaHora(dto.getFechaHora());
        recordatorio.setMascota(mascota);
        return toDTO(recordatorioRepository.save(recordatorio));
    }

    public void eliminarRecordatorio(Integer idRecordatorio, Integer idVeterinario){
        Recordatorio recordatorio = recordatorioRepository.findById(idRecordatorio)
                .orElseThrow(() -> new NoEncontradoException("Recordatorio no encontrado"));
        if(!recordatorio.getVeterinario().getIdUsuario().equals(idVeterinario)){
            throw new IllegalArgumentException("Solo el veterinario puede eliminar este recordatorio");
        }
        recordatorioRepository.delete(recordatorio);
    }

    private RecordatorioDTO toDTO(Recordatorio recordatorio){
        RecordatorioDTO dto = new RecordatorioDTO();
        dto.setDescripcion(recordatorio.getDescripcion());
        dto.setTitulo(recordatorio.getTitulo());
        dto.setIdMascota(recordatorio.getMascota().getIdMascota());
        dto.setIdDuenio(recordatorio.getDuenio().getIdUsuario());
        dto.setFechaHora(recordatorio.getFechaHora());
        dto.setIdVeterinario(recordatorio.getVeterinario().getIdUsuario());
        dto.setFechaCreacion(recordatorio.getFechaCreacion());
        return dto;
    }
}
