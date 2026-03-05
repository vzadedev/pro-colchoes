"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import { usePosicoesRastreamento } from "../../hooks/usePosicoesRastreamento";
import { gerarTelemetriaSimulada } from "../../utils/telemetria";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import PageTransition from "../../components/ui/PageTransition";

const MapRastreamento = dynamic(
  () => import("../../components/MapRastreamento"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 animate-pulse rounded-lg bg-gray-50 border border-gray-100">
        <span className="text-gray-500 font-medium">Carregando mapa...</span>
      </div>
    ),
  }
);

/**
 * Página de rastreamento: veículos em rota com posição simulada (atualizada a cada 5s)
 * e telemetria simulada (horas, km, consumo, alerta manutenção)
 */
export default function RastreamentoPage() {
  const { veiculos, getTransportador } = useLogisticaStore();
  const emRota = useMemo(
    () => veiculos.filter((v) => v.status === "em rota"),
    [veiculos]
  );
  const idsEmRota = useMemo(() => emRota.map((v) => v.id), [emRota]);
  const posicoes = usePosicoesRastreamento(idsEmRota);

  const telemetrias = useMemo(
    () => emRota.map((v) => gerarTelemetriaSimulada(v.id)),
    [emRota]
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Rastreamento de Veículos
        </h2>
        <p className="text-gray-600">
          Veículos em rota com posição e velocidade simuladas (atualização a cada
          5 segundos).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Mapa – veículos em rota" delay={0.1}>
              <div className="h-96 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                {emRota.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-gray-500 font-medium bg-gray-50/50">
                    Nenhum veículo em rota no momento.
                  </div>
                ) : (
                  <MapRastreamento posicoes={posicoes} veiculos={emRota} />
                )}
              </div>
            </Card>
          </div>
          <div>
            <Card title="Lista – posição e status" delay={0.2}>
              <ul className="space-y-3">
                {emRota.length === 0 ? (
                  <li className="text-gray-500 text-sm py-4 text-center">
                    Nenhum veículo em rota.
                  </li>
                ) : (
                  emRota.map((v) => {
                    const pos = posicoes.find((p) => p.veiculoId === v.id);
                    return (
                      <li
                        key={v.id}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors shadow-sm"
                      >
                        <p className="font-medium text-gray-900">{v.placa}</p>
                        <p className="text-sm text-gray-600 font-medium">{v.modelo}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getTransportador(v.transportadorId)?.nome}
                        </p>
                        {pos && (
                          <div className="mt-3 text-xs text-gray-700 bg-white border border-gray-100 rounded-lg p-2 space-y-1">
                            <p className="flex justify-between">
                              <span className="text-gray-500">Lat:</span>
                              <span className="font-medium">{pos.latitude.toFixed(5)}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-500">Lng:</span>
                              <span className="font-medium">{pos.longitude.toFixed(5)}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-500">Velocidade:</span>
                              <span className="font-medium">{pos.velocidade} km/h</span>
                            </p>
                            <div className="pt-2 mt-2 border-t border-gray-100">
                              <Badge variant="warning">{pos.status}</Badge>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            </Card>
          </div>
        </div>

        <Card title="Telemetria simulada" delay={0.3}>
          <p className="text-sm text-gray-500 mb-4">
            Horas de operação, quilometragem, consumo e alerta de manutenção
            (valores aleatórios).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-600 bg-gray-50/50">
                  <th className="py-3 px-4 font-medium rounded-tl-lg">Veículo</th>
                  <th className="py-3 font-medium">Horas operação</th>
                  <th className="py-3 font-medium">Quilometragem</th>
                  <th className="py-3 font-medium">Consumo (L)</th>
                  <th className="py-3 font-medium rounded-tr-lg">Alerta manutenção</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Nenhum veículo cadastrado.
                    </td>
                  </tr>
                ) : (
                  veiculos.map((v) => {
                    const tel = gerarTelemetriaSimulada(v.id);
                    return (
                      <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{v.placa}</td>
                        <td className="py-3 text-gray-700">{tel.horasOperacao}h</td>
                        <td className="py-3 text-gray-700 font-medium">
                          {tel.quilometragem.toLocaleString("pt-BR")} km
                        </td>
                        <td className="py-3 text-gray-700">{tel.consumoCombustivel} L</td>
                        <td className="py-3">
                          {tel.alertaManutencao ? (
                            <Badge variant="danger">Sim</Badge>
                          ) : (
                            <Badge variant="success">Não</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
