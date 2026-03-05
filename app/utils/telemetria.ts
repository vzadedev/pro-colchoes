/**
 * Gera dados de telemetria simulados para um veículo:
 * horas de operação, quilometragem, consumo, alerta de manutenção
 */
import type { TelemetriaVeiculo } from "../types";

export function gerarTelemetriaSimulada(veiculoId: string): TelemetriaVeiculo {
  const horas = Math.round(100 + Math.random() * 500);
  const km = Math.round(5000 + Math.random() * 45000);
  const consumo = Math.round((km / 3.5 + Math.random() * 50) * 10) / 10;
  const alerta = horas > 400 || Math.random() > 0.7;
  return {
    veiculoId,
    horasOperacao: horas,
    quilometragem: km,
    consumoCombustivel: consumo,
    alertaManutencao: alerta,
  };
}
