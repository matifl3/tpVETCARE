package model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class Cuidador {
    private int idCuidador;
    private String nombre;
    private String apellido;
    private String especialidad;
    private String telefono;
    private String email;
    private boolean disponible;

}