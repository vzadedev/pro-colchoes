"use client";

import { useMemo } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import Card from "../../components/ui/Card";
import PageTransition from "../../components/ui/PageTransition";

/**
 * Dashboard – indicadores e gráficos simulados a partir dos arrays do store
 */
export default function DashboardPage() {
  const {
    transportadores,
    veiculos,
    cargas,
    entregas,
  } = useLogisticaStore();

  const indicadores = useMemo(() => {
    const cargasEmTransporte = cargas.filter(
      (c) => c.status === "em transporte"
    ).length;
    const entregasFinalizadas = entregas.filter(
      (e) => e.status === "concluída"
    ).length;
    const avarias = entregas.filter((e) => e.temAvaria).length;
    return {
      totalTransportadores: transportadores.length,
      totalVeiculos: veiculos.length,
      cargasEmTransporte,
      entregasFinalizadas,
      avarias,
    };
  }, [transportadores.length, veiculos.length, cargas, entregas]);

  // Gráfico simulado: entregas por mês (últimos 6 meses)
  const entregasPorMes = useMemo(() => {
    const meses: { mes: string; total: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mesAno = d.toLocaleDateString("pt-BR", {
        month: "short",
        year: "2-digit",
      });
      const total = entregas.filter((e) => {
        if (!e.dataEntrega) return false;
        const ed = new Date(e.dataEntrega);
        return (
          ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear()
        );
      }).length;
      meses.push({ mes: mesAno, total });
    }
    return meses;
  }, [entregas]);

  const maxEntregas = Math.max(
    ...entregasPorMes.map((m) => m.total),
    1
  );

  // Desempenho por transportador (média de avaliação + qtd entregas)
  const desempenhoTransportadores = useMemo(() => {
    return transportadores
      .map((t) => {
        const qtdEntregas = entregas.filter(
          (e) => e.transportadorId === t.id && e.status === "concluída"
        ).length;
        return {
          nome: t.nome,
          avaliacao: t.avaliacaoMedia,
          entregas: qtdEntregas,
        };
      })
      .sort((a, b) => b.entregas - a.entregas)
      .slice(0, 5);
  }, [transportadores, entregas]);

  const maxDesempenho = Math.max(
    ...desempenhoTransportadores.map((d) => d.entregas),
    1
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

        {/* Cards de indicadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card delay={0.1}>
            <p className="text-sm text-gray-500">Total de transportadores</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {indicadores.totalTransportadores}
            </p>
          </Card>
          <Card delay={0.2}>
            <p className="text-sm text-gray-500">Total de veículos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {indicadores.totalVeiculos}
            </p>
          </Card>
          <Card delay={0.3}>
            <p className="text-sm text-gray-500">Cargas em transporte</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {indicadores.cargasEmTransporte}
            </p>
          </Card>
          <Card delay={0.4}>
            <p className="text-sm text-gray-500">Entregas finalizadas</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {indicadores.entregasFinalizadas}
            </p>
          </Card>
          <Card delay={0.5}>
            <p className="text-sm text-gray-500">Avarias registradas</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {indicadores.avarias}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico entregas por mês */}
          <Card title="Entregas por mês" delay={0.6}>
            <div className="space-y-3">
              {entregasPorMes.map(({ mes, total }) => (
                <div key={mes} className="flex items-center gap-3">
                  <span className="w-14 text-sm text-gray-600">{mes}</span>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-lg transition-all"
                      style={{
                        width: `${(total / maxEntregas) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{total}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Desempenho transportadores */}
          <Card title="Desempenho dos transportadores" delay={0.7}>
            <div className="space-y-3">
              {desempenhoTransportadores.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhum transportador com entregas ainda.
                </p>
              ) : (
                desempenhoTransportadores.map((d) => (
                  <div key={d.nome} className="flex items-center gap-3">
                    <span className="w-32 text-sm text-gray-700 truncate">
                      {d.nome}
                    </span>
                    <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded transition-all"
                        style={{
                          width: `${(d.entregas / maxDesempenho) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {d.entregas} ent. · ★ {d.avaliacao.toFixed(1)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
