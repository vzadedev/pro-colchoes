"use client";

import { useState, useEffect } from "react";
import type { PosicaoVeiculo } from "../types";

/** Centro aproximado MS (Campo Grande) para simulação */
const CENTRO_LAT = -20.4697;
const CENTRO_LNG = -54.6201;
const RAIO = 0.05;

function randomOffset() {
  return (Math.random() - 0.5) * 2 * RAIO;
}

/**
 * Gera/atualiza posições simuladas para veículos em rota.
 * Atualiza a cada 5 segundos com valores aleatórios.
 */
export function usePosicoesRastreamento(veiculoIds: string[]) {
  const [posicoes, setPosicoes] = useState<PosicaoVeiculo[]>(() =>
    veiculoIds.map((id) => ({
      veiculoId: id,
      latitude: CENTRO_LAT + randomOffset(),
      longitude: CENTRO_LNG + randomOffset(),
      velocidade: Math.round(30 + Math.random() * 70),
      status: ["Em rota", "Parado", "Em deslocamento"][
        Math.floor(Math.random() * 3)
      ],
      lastUpdate: new Date().toISOString(),
    }))
  );

  useEffect(() => {
    if (veiculoIds.length === 0) {
      setPosicoes([]);
      return;
    }
    const interval = setInterval(() => {
      setPosicoes((prev) =>
        veiculoIds.map((id) => {
          const current =
            prev.find((p) => p.veiculoId === id) ||
            ({
              veiculoId: id,
              latitude: CENTRO_LAT + randomOffset(),
              longitude: CENTRO_LNG + randomOffset(),
              velocidade: 50,
              status: "Em rota",
              lastUpdate: new Date().toISOString(),
            } as PosicaoVeiculo);
          return {
            ...current,
            latitude: current.latitude + (Math.random() - 0.5) * 0.005,
            longitude: current.longitude + (Math.random() - 0.5) * 0.005,
            velocidade: Math.round(20 + Math.random() * 80),
            status: ["Em rota", "Parado", "Em deslocamento"][
              Math.floor(Math.random() * 3)
            ],
            lastUpdate: new Date().toISOString(),
          };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [veiculoIds.join(",")]);

  return posicoes;
}
