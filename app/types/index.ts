/**
 * Tipos e interfaces do LogiTrack – Sistema de Gestão Logística
 * Protótipo acadêmico – dados apenas em memória
 */

/** Transportador (motorista/empresa de transporte) */
export interface Transportador {
  id: string;
  nome: string;
  cpfOuCnpj: string;
  telefone: string;
  email: string;
  empresa: string;
  avaliacaoMedia: number;
}

/** Tipos de veículo */
export type TipoVeiculo = "caminhão" | "carreta";

/** Status do veículo */
export type StatusVeiculo = "disponível" | "em rota" | "manutenção";

/** Veículo */
export interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  tipo: TipoVeiculo;
  capacidadeCarga: number; // kg
  transportadorId: string;
  status: StatusVeiculo;
}

/** Status da carga */
export type StatusCarga =
  | "aguardando"
  | "carregado"
  | "em transporte"
  | "entregue";

/** Carga */
export interface Carga {
  id: string;
  produto: string;
  quantidade: number;
  peso: number; // kg
  origem: string;
  destino: string;
  status: StatusCarga;
  dataCarregamento: string; // ISO
  dataEntregaPrevista: string; // ISO
  veiculoId: string | null;
}

/** Nota fiscal */
export interface NotaFiscal {
  id: string;
  numeroNota: string;
  valor: number;
  icms: number;
  cfop: string;
  cnpjCliente: string;
  enderecoEntrega: string;
  status: string;
}

/** Status da entrega */
export type StatusEntrega = "pendente" | "em rota" | "concluída" | "avaria" | "devolução";

/** Entrega */
export interface Entrega {
  id: string;
  transportadorId: string;
  veiculoId: string;
  cargaId: string;
  status: StatusEntrega;
  dataEntrega: string | null; // ISO, preenchido quando concluída
  temAvaria: boolean;
  descricaoAvaria: string;
}

/** Avaliação de transportador */
export interface Avaliacao {
  id: string;
  transportadorId: string;
  nota: number; // 1 a 5
  comentario: string;
  createdAt: string; // ISO
}

/** Posição simulada para rastreamento */
export interface PosicaoVeiculo {
  veiculoId: string;
  latitude: number;
  longitude: number;
  velocidade: number; // km/h
  status: string;
  lastUpdate: string;
}

/** Telemetria simulada do veículo */
export interface TelemetriaVeiculo {
  veiculoId: string;
  horasOperacao: number;
  quilometragem: number;
  consumoCombustivel: number; // L
  alertaManutencao: boolean;
}
