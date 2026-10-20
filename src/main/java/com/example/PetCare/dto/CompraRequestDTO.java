package com.example.PetCare.dto;

import com.example.PetCare.enums.Metodo_Pago;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompraRequestDTO {
    private Integer id_usuario;
    private Metodo_Pago metodoPago;

    //si elije tarjeta
    private Integer idTarjetaGuardada; //tarjeta con datos ya cargados anteriormente
    private TarjetaRequestDTO tarjetaNueva; //si elije ingresar los datos de la tarjeta en el momento
}
