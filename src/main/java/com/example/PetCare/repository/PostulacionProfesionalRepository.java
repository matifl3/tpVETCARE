package com.example.PetCare.repository;

import com.example.PetCare.model.EstadoPostulacion;
import com.example.PetCare.model.PostulacionProfesional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostulacionProfesionalRepository extends JpaRepository<PostulacionProfesional, Integer> {

    List<PostulacionProfesional> findByEstado(EstadoPostulacion estado);
}
