"use client";

import { create } from "zustand";
import type {
  Transportador,
  Veiculo,
  Carga,
  NotaFiscal,
  Entrega,
  Avaliacao,
} from "../types";
import { generateId } from "../utils/id";

/**
 * Store global do LogiTrack – todos os dados em memória.
 * CRUD e derivados (médias de avaliação, etc.) são resolvidos aqui.
 */
interface LogisticaState {
  transportadores: Transportador[];
  veiculos: Veiculo[];
  cargas: Carga[];
  notasFiscais: NotaFiscal[];
  entregas: Entrega[];
  avaliacoes: Avaliacao[];

  // Transportadores
  addTransportador: (d: Omit<Transportador, "id" | "avaliacaoMedia">) => void;
  updateTransportador: (id: string, d: Partial<Transportador>) => void;
  removeTransportador: (id: string) => void;
  getTransportador: (id: string) => Transportador | undefined;

  // Veículos
  addVeiculo: (d: Omit<Veiculo, "id">) => void;
  updateVeiculo: (id: string, d: Partial<Veiculo>) => void;
  removeVeiculo: (id: string) => void;
  getVeiculo: (id: string) => Veiculo | undefined;

  // Cargas
  addCarga: (d: Omit<Carga, "id">) => void;
  updateCarga: (id: string, d: Partial<Carga>) => void;
  removeCarga: (id: string) => void;
  getCarga: (id: string) => Carga | undefined;

  // Notas Fiscais
  addNotaFiscal: (d: Omit<NotaFiscal, "id">) => void;
  updateNotaFiscal: (id: string, d: Partial<NotaFiscal>) => void;
  removeNotaFiscal: (id: string) => void;

  // Entregas
  addEntrega: (d: Omit<Entrega, "id">) => void;
  updateEntrega: (id: string, d: Partial<Entrega>) => void;
  getEntrega: (id: string) => Entrega | undefined;

  // Avaliações (atualiza média do transportador)
  addAvaliacao: (d: Omit<Avaliacao, "id" | "createdAt">) => void;
  getAvaliacoesByTransportador: (transportadorId: string) => Avaliacao[];

  // Helpers
  getTransportadoresDisponiveis: () => Transportador[];
  getVeiculosDisponiveis: () => Veiculo[];
  recalcAvaliacaoMedia: (transportadorId: string) => void;
}

function calcMedia(avaliacoes: Avaliacao[]): number {
  if (avaliacoes.length === 0) return 0;
  const sum = avaliacoes.reduce((s, a) => s + a.nota, 0);
  return Math.round((sum / avaliacoes.length) * 10) / 10; // 1 casa decimal
}

export const useLogisticaStore = create<LogisticaState>((set, get) => ({
  transportadores: [],
  veiculos: [],
  cargas: [],
  notasFiscais: [],
  entregas: [],
  avaliacoes: [],

  addTransportador: (d) => {
    const id = generateId();
    set((s) => ({
      transportadores: [
        ...s.transportadores,
        { ...d, id, avaliacaoMedia: 0 },
      ],
    }));
  },

  updateTransportador: (id, d) => {
    set((s) => ({
      transportadores: s.transportadores.map((t) =>
        t.id === id ? { ...t, ...d } : t
      ),
    }));
  },

  removeTransportador: (id) => {
    set((s) => ({
      transportadores: s.transportadores.filter((t) => t.id !== id),
      veiculos: s.veiculos.filter((v) => v.transportadorId !== id),
      avaliacoes: s.avaliacoes.filter((a) => a.transportadorId !== id),
    }));
  },

  getTransportador: (id) => get().transportadores.find((t) => t.id === id),

  addVeiculo: (d) => {
    set((s) => ({
      veiculos: [...s.veiculos, { ...d, id: generateId() }],
    }));
  },

  updateVeiculo: (id, d) => {
    set((s) => ({
      veiculos: s.veiculos.map((v) => (v.id === id ? { ...v, ...d } : v)),
    }));
  },

  removeVeiculo: (id) => {
    set((s) => ({
      veiculos: s.veiculos.filter((v) => v.id !== id),
      cargas: s.cargas.map((c) =>
        c.veiculoId === id ? { ...c, veiculoId: null } : c
      ),
    }));
  },

  getVeiculo: (id) => get().veiculos.find((v) => v.id === id),

  addCarga: (d) => {
    set((s) => ({
      cargas: [...s.cargas, { ...d, id: generateId() }],
    }));
  },

  updateCarga: (id, d) => {
    set((s) => ({
      cargas: s.cargas.map((c) => (c.id === id ? { ...c, ...d } : c)),
    }));
  },

  removeCarga: (id) => {
    set((s) => ({
      cargas: s.cargas.filter((c) => c.id !== id),
      entregas: s.entregas.filter((e) => e.cargaId !== id),
    }));
  },

  getCarga: (id) => get().cargas.find((c) => c.id === id),

  addNotaFiscal: (d) => {
    set((s) => ({
      notasFiscais: [...s.notasFiscais, { ...d, id: generateId() }],
    }));
  },

  updateNotaFiscal: (id, d) => {
    set((s) => ({
      notasFiscais: s.notasFiscais.map((n) =>
        n.id === id ? { ...n, ...d } : n
      ),
    }));
  },

  removeNotaFiscal: (id) => {
    set((s) => ({
      notasFiscais: s.notasFiscais.filter((n) => n.id !== id),
    }));
  },

  addEntrega: (d) => {
    set((s) => ({
      entregas: [...s.entregas, { ...d, id: generateId() }],
    }));
  },

  updateEntrega: (id, d) => {
    set((s) => ({
      entregas: s.entregas.map((e) => (e.id === id ? { ...e, ...d } : e)),
    }));
  },

  getEntrega: (id) => get().entregas.find((e) => e.id === id),

  addAvaliacao: (d) => {
    const id = generateId();
    const createdAt = new Date().toISOString();
    set((s) => ({
      avaliacoes: [...s.avaliacoes, { ...d, id, createdAt }],
    }));
    get().recalcAvaliacaoMedia(d.transportadorId);
  },

  getAvaliacoesByTransportador: (transportadorId) =>
    get().avaliacoes.filter((a) => a.transportadorId === transportadorId),

  getTransportadoresDisponiveis: () => {
    const { transportadores, veiculos } = get();
    const comVeiculoDisponivel = new Set(
      veiculos
        .filter((v) => v.status === "disponível")
        .map((v) => v.transportadorId)
    );
    return transportadores.filter((t) => comVeiculoDisponivel.has(t.id));
  },

  getVeiculosDisponiveis: () =>
    get().veiculos.filter((v) => v.status === "disponível"),

  recalcAvaliacaoMedia: (transportadorId) => {
    const avaliacoes = get().avaliacoes.filter(
      (a) => a.transportadorId === transportadorId
    );
    const media = calcMedia(avaliacoes);
    set((s) => ({
      transportadores: s.transportadores.map((t) =>
        t.id === transportadorId ? { ...t, avaliacaoMedia: media } : t
      ),
    }));
  },
}));
