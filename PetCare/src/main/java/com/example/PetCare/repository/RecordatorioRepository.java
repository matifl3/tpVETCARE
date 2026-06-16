package com.example.PetCare.repository;

import com.example.PetCare.model.Recordatorio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecordatorioRepository extends JpaRepository<Recordatorio, Integer> {
    List<Recordatorio> findbyDuenioIdUsuario(Integer idDuenio);
    List<Recordatorio> findbyVeterinarioIdUsuario(Integer idVeterinario);
}
