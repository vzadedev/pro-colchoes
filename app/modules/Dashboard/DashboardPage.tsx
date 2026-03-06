"use client";

import { useMemo } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import Card from "../../components/ui/Card";
import PageTransition from "../../components/ui/PageTransition";
import { Users, Truck, PackageCheck, ClipboardList, AlertTriangle } from "lucide-react";

/**
 * Dashboard – indicadores e gráficos simulados a partir dos arrays do store
 */
export default function DashboardPage() {
  const { transportadores, veiculos, cargas, entregas } = useLogisticaStore();

  const indicadores = useMemo(() => {
    const cargasEmTransporte = cargas.filter((c) => c.status === "em transporte").length;
    const entregasFinalizadas = entregas.filter((e) => e.status === "concluída").length;
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
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
      }).length;
      meses.push({ mes: mesAno, total });
    }
    return meses;
  }, [entregas]);

  const maxEntregas = Math.max(...entregasPorMes.map((m) => m.total), 1);

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

  const maxDesempenho = Math.max(...desempenhoTransportadores.map((d) => d.entregas), 1);

  return (
    <PageTransition>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Visão Geral Logística
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Acompanhe o desempenho e as métricas em tempo real.
          </p>
        </div>

        {/* Cards de indicadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <Card delay={0.1} className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100/50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-200/50 dark:border-blue-500/20 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de transportadores</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
              {indicadores.totalTransportadores}
            </p>
          </Card>

          <Card delay={0.2} className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100/50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de veículos</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
              {indicadores.totalVeiculos}
            </p>
          </Card>

          <Card delay={0.3} className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100/50 dark:bg-amber-500/10 flex items-center justify-center border border-amber-200/50 dark:border-amber-500/20 group-hover:scale-110 transition-transform">
                <PackageCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Cargas em transporte</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-500 mt-1">
              {indicadores.cargasEmTransporte}
            </p>
          </Card>

          <Card delay={0.4} className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100/50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-500/20 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Entregas finalizadas</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {indicadores.entregasFinalizadas}
            </p>
          </Card>

          <Card delay={0.5} className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100/50 dark:bg-rose-500/10 flex items-center justify-center border border-rose-200/50 dark:border-rose-500/20 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avarias registradas</p>
            <p className="text-3xl font-bold text-rose-600 dark:text-rose-500 mt-1">
              {indicadores.avarias}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico entregas por mês */}
          <Card title="Evolução de Entregas (6 meses)" delay={0.6}>
            <div className="space-y-5 mt-2">
              {entregasPorMes.map(({ mes, total }) => (
                <div key={mes} className="flex items-center gap-4 group">
                  <span className="w-16 text-sm font-medium text-slate-500 dark:text-slate-400">{mes}</span>
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      style={{
                        width: `${(total / maxEntregas) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right group-hover:scale-110 transition-transform">{total}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Desempenho transportadores */}
          <Card title="Top Transportadores" delay={0.7}>
            <div className="space-y-4 mt-2">
              {desempenhoTransportadores.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 dark:bg-zinc-800/20 rounded-xl border border-dashed border-slate-200 dark:border-zinc-700">
                  <Truck className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Nenhum transportador com entregas ainda.
                  </p>
                </div>
              ) : (
                desempenhoTransportadores.map((d, idx) => (
                  <div key={d.nome} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-zinc-700/50">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {d.nome}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${(d.entregas / maxDesempenho) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {d.entregas} <span className="text-[10px] text-slate-400 font-normal">ent.</span>
                      </span>
                      <span className="text-[11px] font-medium text-amber-500 flex items-center gap-0.5">
                        ★ {d.avaliacao.toFixed(1)}
                      </span>
                    </div>
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
