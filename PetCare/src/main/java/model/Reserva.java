package model;

import java.sql.Date;
import java.sql.Time;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data

public class Reserva {
    private int idReserva;
    private Date fecha;
    private Time hora;
    private String servicio;
    private String estado;
    private int idUsuario;
    private int idCuidador;
    private int idMascota;


}