package com.example.PetCare.service;

import com.example.PetCare.dto.EstadisticasTurnosDTO;
import com.example.PetCare.dto.ResumenTurnosDTO;
import com.example.PetCare.dto.ServicioRankingDTO;
import com.example.PetCare.dto.TurnoPeriodoDTO;
import com.example.PetCare.enums.AgrupacionPeriodo;
import com.example.PetCare.repository.TurnoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Arma el panel de estadísticas de turnos.
 * Los datos se leen de la base en cada consulta (sin caché), de modo que el
 * administrador ve siempre el estado actual de los turnos.
 *
 * Reglas:
 * - Solo cuentan los turnos activos y no cancelados.
 * - Los cancelados se informan aparte en el resumen, no en los gráficos.
 * - Los períodos sin turnos se completan con 0 para que el gráfico sea continuo.
 */
@Service
@Transactional(readOnly = true)
public class EstadisticaTurnoService {

    // Evita generar gráficos con miles de barras si se elige un rango enorme con agrupación diaria.
    private static final int MAX_PERIODOS = 400;

    private static final DateTimeFormatter FORMATO_CLAVE_DIA = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static final String[] MESES_ABREVIADOS = {
            "Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    };

    private final TurnoRepository turnoRepository;

    public EstadisticaTurnoService(TurnoRepository turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    public EstadisticasTurnosDTO obtenerEstadisticas(LocalDate desde, LocalDate hasta, AgrupacionPeriodo agrupacion) {
        validarRango(desde, hasta);
        AgrupacionPeriodo agrupacionFinal = agrupacion != null ? agrupacion : AgrupacionPeriodo.MES;

        List<Periodo> periodos = generarPeriodos(desde, hasta, agrupacionFinal);

        Map<String, Long> conteoPorPeriodo = new HashMap<>();
        for (Object[] fila : turnoRepository.contarTurnosPorPeriodo(desde, hasta, formatoFecha(agrupacionFinal))) {
            conteoPorPeriodo.merge(String.valueOf(fila[0]), aLong(fila[1]), Long::sum);
        }

        List<TurnoPeriodoDTO> porPeriodo = periodos.stream()
                .map(p -> new TurnoPeriodoDTO(p.clave(), p.etiqueta(), conteoPorPeriodo.getOrDefault(p.clave(), 0L)))
                .toList();

        long total = conteoPorPeriodo.values().stream().mapToLong(Long::longValue).sum();

        List<ServicioRankingDTO> rankingServicios = construirRanking(desde, hasta);
        String servicioTop = rankingServicios.isEmpty() ? "Sin datos" : rankingServicios.get(0).getServicio();

        ResumenTurnosDTO resumen = new ResumenTurnosDTO(
                total,
                contarConfirmados(desde, hasta),
                turnoRepository.contarTurnosCancelados(desde, hasta),
                contarProximos(desde, hasta),
                servicioTop
        );

        return new EstadisticasTurnosDTO(
                desde.toString(),
                hasta.toString(),
                agrupacionFinal.name(),
                resumen,
                porPeriodo,
                rankingServicios
        );
    }

    // ==================== ARMADO DE DATOS ====================

    private List<ServicioRankingDTO> construirRanking(LocalDate desde, LocalDate hasta) {
        List<Object[]> filas = turnoRepository.contarTurnosPorServicio(desde, hasta);

        long totalServicios = filas.stream()
                .mapToLong(fila -> aLong(fila[1]))
                .sum();

        List<ServicioRankingDTO> ranking = new ArrayList<>();
        for (Object[] fila : filas) {
            long cantidad = aLong(fila[1]);
            double porcentaje = totalServicios == 0
                    ? 0.0
                    : Math.round(cantidad * 1000.0 / totalServicios) / 10.0;
            ranking.add(new ServicioRankingDTO(String.valueOf(fila[0]), cantidad, porcentaje));
        }
        return ranking;
    }

    private long contarConfirmados(LocalDate desde, LocalDate hasta) {
        return leerResumen(desde, hasta, 1);
    }

    private long contarProximos(LocalDate desde, LocalDate hasta) {
        return leerResumen(desde, hasta, 2);
    }

    /** Ejecuta la consulta de totales y devuelve la columna indicada (1 = confirmados, 2 = próximos). */
    private long leerResumen(LocalDate desde, LocalDate hasta, int columna) {
        List<Object[]> filas = turnoRepository.resumirTurnos(desde, hasta);
        if (filas.isEmpty()) return 0L;
        return aLong(filas.get(0)[columna]);
    }

    // ==================== PERÍODOS ====================

    private List<Periodo> generarPeriodos(LocalDate desde, LocalDate hasta, AgrupacionPeriodo agrupacion) {
        return switch (agrupacion) {
            case DIA -> generarPeriodosPorDia(desde, hasta);
            case SEMANA -> generarPeriodosPorSemana(desde, hasta);
            case MES -> generarPeriodosPorMes(desde, hasta);
        };
    }

    private List<Periodo> generarPeriodosPorDia(LocalDate desde, LocalDate hasta) {
        List<Periodo> periodos = new ArrayList<>();
        for (LocalDate dia = desde; !dia.isAfter(hasta); dia = dia.plusDays(1)) {
            periodos.add(new Periodo(
                    dia.format(FORMATO_CLAVE_DIA),
                    String.format("%02d/%02d", dia.getDayOfMonth(), dia.getMonthValue())
            ));
            validarCantidadPeriodos(periodos.size());
        }
        return periodos;
    }

    private List<Periodo> generarPeriodosPorSemana(LocalDate desde, LocalDate hasta) {
        List<Periodo> periodos = new ArrayList<>();
        // Se arranca en el lunes de la semana que contiene "desde" para que la clave coincida con la de MySQL (%x-W%v).
        LocalDate lunes = desde.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        for (LocalDate dia = lunes; !dia.isAfter(hasta); dia = dia.plusWeeks(1)) {
            int semana = dia.get(WeekFields.ISO.weekOfWeekBasedYear());
            int anioSemana = dia.get(WeekFields.ISO.weekBasedYear());
            periodos.add(new Periodo(
                    String.format("%04d-W%02d", anioSemana, semana),
                    String.format("Sem %02d", semana)
            ));
            validarCantidadPeriodos(periodos.size());
        }
        return periodos;
    }

    private List<Periodo> generarPeriodosPorMes(LocalDate desde, LocalDate hasta) {
        List<Periodo> periodos = new ArrayList<>();
        YearMonth fin = YearMonth.from(hasta);
        for (YearMonth mes = YearMonth.from(desde); !mes.isAfter(fin); mes = mes.plusMonths(1)) {
            periodos.add(new Periodo(
                    mes.toString(),
                    MESES_ABREVIADOS[mes.getMonthValue() - 1] + " " + mes.getYear()
            ));
            validarCantidadPeriodos(periodos.size());
        }
        return periodos;
    }

    private void validarCantidadPeriodos(int cantidad) {
        if (cantidad > MAX_PERIODOS) {
            throw new IllegalArgumentException(
                    "El rango es demasiado grande para la agrupación elegida. Probá con una agrupación más amplia (mes) o un rango más corto.");
        }
    }

    // ==================== UTILIDADES ====================

    private void validarRango(LocalDate desde, LocalDate hasta) {
        if (desde == null || hasta == null) {
            throw new IllegalArgumentException("Las fechas 'desde' y 'hasta' son obligatorias");
        }
        if (desde.isAfter(hasta)) {
            throw new IllegalArgumentException("La fecha 'desde' no puede ser posterior a la fecha 'hasta'");
        }
    }

    private String formatoFecha(AgrupacionPeriodo agrupacion) {
        return switch (agrupacion) {
            case DIA -> "%Y-%m-%d";
            case SEMANA -> "%x-W%v";
            case MES -> "%Y-%m";
        };
    }

    private long aLong(Object valor) {
        return valor == null ? 0L : ((Number) valor).longValue();
    }

    /** Período interno: clave técnica (la que devuelve la query) y etiqueta para mostrar. */
    private record Periodo(String clave, String etiqueta) {
    }
}
