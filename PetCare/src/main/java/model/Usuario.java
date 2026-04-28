package model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
@NoArgsConstructor
public class Usuario {
    private int idUsuario;
    private String nombre;
    private String apellido;
    private String telefono;
    private String email;
    private String direccion;
    private boolean activo;

}