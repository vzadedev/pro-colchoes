"use client";

import { useState, useMemo } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import Card from "../../components/ui/Card";
import PageTransition from "../../components/ui/PageTransition";
import { FileDown, FileSpreadsheet, Filter } from "lucide-react";
import { toast } from "sonner";

type TipoRelatorio =
  | "entregas"
  | "avarias"
  | "desempenho"
  | "tempo-medio";

/**
 * Módulo Relatórios – relatórios simulados com filtros;
 * botões Exportar PDF/Excel apenas simulados
 */
export default function RelatoriosPage() {
  const { entregas, transportadores, getTransportador, getVeiculo, getCarga } =
    useLogisticaStore();
  const [tipo, setTipo] = useState<TipoRelatorio>("entregas");
  const [filtroStatus, setFiltroStatus] = useState<string>("");
  const [filtroTransportador, setFiltroTransportador] = useState<string>("");

  const dadosFiltrados = useMemo(() => {
    let list = [...entregas];
    if (filtroStatus)
      list = list.filter((e) => e.status === filtroStatus);
    if (filtroTransportador)
      list = list.filter((e) => e.transportadorId === filtroTransportador);
    return list;
  }, [entregas, filtroStatus, filtroTransportador]);

  const relatorioEntregas = useMemo(() => {
    return dadosFiltrados.map((e) => ({
      id: e.id,
      transportador: getTransportador(e.transportadorId)?.nome ?? "-",
      veiculo: getVeiculo(e.veiculoId)?.placa ?? "-",
      carga: getCarga(e.cargaId)?.produto ?? "-",
      status: e.status,
      dataEntrega: e.dataEntrega
        ? new Date(e.dataEntrega).toLocaleString("pt-BR")
        : "-",
    }));
  }, [dadosFiltrados, getTransportador, getVeiculo, getCarga]);

  const relatorioAvarias = useMemo(() => {
    return dadosFiltrados
      .filter((e) => e.temAvaria)
      .map((e) => ({
        id: e.id,
        transportador: getTransportador(e.transportadorId)?.nome ?? "-",
        carga: getCarga(e.cargaId)?.produto ?? "-",
        descricao: e.descricaoAvaria || "Avaria registrada",
        data: e.dataEntrega
          ? new Date(e.dataEntrega).toLocaleString("pt-BR")
          : "-",
      }));
  }, [dadosFiltrados, getTransportador, getCarga]);

  const relatorioDesempenho = useMemo(() => {
    return transportadores.map((t) => {
      const ent = entregas.filter(
        (e) => e.transportadorId === t.id && e.status === "concluída"
      );
      const avarias = entregas.filter(
        (e) => e.transportadorId === t.id && e.temAvaria
      );
      return {
        nome: t.nome,
        empresa: t.empresa,
        avaliacao: t.avaliacaoMedia,
        entregasConcluidas: ent.length,
        avarias: avarias.length,
      };
    });
  }, [transportadores, entregas]);

  const tempoMedio = useMemo(() => {
    const comData = entregas.filter(
      (e) => e.status === "concluída" && e.dataEntrega
    );
    if (comData.length === 0) return null;
    // Simulação: "tempo médio" baseado em quantidade de entregas
    const diasSimulados = 2 + Math.random() * 3;
    return { media: diasSimulados.toFixed(1), total: comData.length };
  }, [entregas]);

  const handleExportPDF = () => {
    toast.info("Exportar PDF (simulado)", {
      description: "Em produção, seria gerado um arquivo PDF.",
    });
  };

  const handleExportExcel = () => {
    toast.info("Exportar Excel (simulado)", {
      description: "Em produção, seria gerado um arquivo .xlsx.",
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
        <p className="text-gray-600">
          Relatórios simulados. Use os filtros e os botões de exportação
          (simulados).
        </p>

        <Card delay={0.1}>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros</span>
            </div>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoRelatorio)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="entregas">Entregas realizadas</option>
              <option value="avarias">Avarias registradas</option>
              <option value="desempenho">Desempenho transportadores</option>
              <option value="tempo-medio">Tempo médio de entrega</option>
            </select>
            {(tipo === "entregas" || tipo === "avarias") && (
              <>
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="">Todos os status</option>
                  <option value="concluída">Concluída</option>
                  <option value="avaria">Avaria</option>
                  <option value="devolução">Devolução</option>
                  <option value="em rota">Em rota</option>
                  <option value="pendente">Pendente</option>
                </select>
                <select
                  value={filtroTransportador}
                  onChange={(e) => setFiltroTransportador(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="">Todos transportadores</option>
                  {transportadores.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome}
                    </option>
                  ))}
                </select>
              </>
            )}
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm transition-colors font-medium border border-red-100"
              >
                <FileDown className="w-4 h-4" />
                Exportar PDF
              </button>
              <button
                type="button"
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm transition-colors font-medium border border-green-100"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {tipo === "entregas" && (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-600 bg-gray-50/50">
                    <th className="py-3 px-4 font-medium rounded-tl-lg">Transportador</th>
                    <th className="py-3 font-medium">Veículo</th>
                    <th className="py-3 font-medium">Carga</th>
                    <th className="py-3 font-medium">Status</th>
                    <th className="py-3 font-medium rounded-tr-lg">Data entrega</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorioEntregas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        Nenhum registro.
                      </td>
                    </tr>
                  ) : (
                    relatorioEntregas.map((r) => (
                      <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 text-gray-900">{r.transportador}</td>
                        <td className="py-3 text-gray-600">{r.veiculo}</td>
                        <td className="py-3 text-gray-600">{r.carga}</td>
                        <td className="py-3 text-gray-600 capitalize">{r.status}</td>
                        <td className="py-3 text-gray-600">{r.dataEntrega}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {tipo === "avarias" && (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-600 bg-gray-50/50">
                    <th className="py-3 px-4 font-medium rounded-tl-lg">Transportador</th>
                    <th className="py-3 font-medium">Carga</th>
                    <th className="py-3 font-medium">Descrição</th>
                    <th className="py-3 font-medium rounded-tr-lg">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorioAvarias.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        Nenhuma avaria registrada.
                      </td>
                    </tr>
                  ) : (
                    relatorioAvarias.map((r) => (
                      <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 text-gray-900">{r.transportador}</td>
                        <td className="py-3 text-gray-600">{r.carga}</td>
                        <td className="py-3 text-gray-600">{r.descricao}</td>
                        <td className="py-3 text-gray-600">{r.data}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {tipo === "desempenho" && (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-600 bg-gray-50/50">
                    <th className="py-3 px-4 font-medium rounded-tl-lg">Nome</th>
                    <th className="py-3 font-medium">Empresa</th>
                    <th className="py-3 font-medium">Avaliação</th>
                    <th className="py-3 font-medium">Entregas concluídas</th>
                    <th className="py-3 font-medium rounded-tr-lg">Avarias</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorioDesempenho.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        Nenhum transportador.
                      </td>
                    </tr>
                  ) : (
                    relatorioDesempenho.map((r) => (
                      <tr key={r.nome} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{r.nome}</td>
                        <td className="py-3 text-gray-600">{r.empresa}</td>
                        <td className="py-3 text-gray-600">{r.avaliacao > 0 ? r.avaliacao.toFixed(1) : "-"}</td>
                        <td className="py-3 text-gray-600">{r.entregasConcluidas}</td>
                        <td className="py-3 text-gray-600">{r.avarias}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {tipo === "tempo-medio" && (
              <div className="py-8 px-4 bg-gray-50/50 rounded-lg border border-gray-50 mt-4 text-center">
                {tempoMedio ? (
                  <p className="text-gray-700 text-lg">
                    Tempo médio de entrega:{" "}
                    <strong className="text-blue-600 font-bold text-2xl ml-2">{tempoMedio.media} dias</strong>
                    <span className="block text-sm text-gray-500 mt-2">
                      (baseado em {tempoMedio.total} entregas concluídas – valor simulado)
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-500">
                    Nenhuma entrega concluída para calcular tempo médio.
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
