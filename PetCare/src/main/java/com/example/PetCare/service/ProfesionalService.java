package com.example.PetCare.service;

import com.example.PetCare.exceptions.NoEncontradoException;
import com.example.PetCare.model.Profesional;
import com.example.PetCare.repository.ProfesionalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfesionalService {
    private final ProfesionalRepository profesionalRepository;

    public ProfesionalService(ProfesionalRepository profesionalRepository) {
        this.profesionalRepository = profesionalRepository;
    }

    public Profesional crear (Profesional profesional){
        return profesionalRepository.save(profesional);
    }

    public Profesional actualizar(int id, Profesional profesional){
        Profesional existente = profesionalRepository.findById(profesional.getIdUsuario())
                .orElseThrow(() -> new NoEncontradoException("El profesional no fue encontrado"));
        profesional.setIdUsuario(id);
        return profesionalRepository.save(profesional);
    }

    public void eliminar (int id){
        profesionalRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("El profesional no fue encontrado"));
        profesionalRepository.deleteById(id);
    }

    public List<Profesional> listarTodos(){
        return profesionalRepository.findAll();
    }
}
