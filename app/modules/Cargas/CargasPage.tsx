"use client";

import { useState } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import type { Carga, StatusCarga } from "../../types";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Badge, { variants } from "../../components/ui/Badge";
import PageTransition from "../../components/ui/PageTransition";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Plus, Pencil, Trash2, Shuffle } from "lucide-react";
import { toast } from "sonner";

const statusVariant: Record<StatusCarga, keyof typeof variants> = {
  aguardando: "neutral",
  carregado: "info",
  "em transporte": "warning",
  entregue: "success",
};

const emptyForm = {
  produto: "",
  quantidade: 0,
  peso: 0,
  origem: "",
  destino: "",
  status: "aguardando" as StatusCarga,
  dataCarregamento: new Date().toISOString().slice(0, 10),
  dataEntregaPrevista: new Date(Date.now() + 86400000 * 3)
    .toISOString()
    .slice(0, 10),
  veiculoId: null as string | null,
};

/**
 * Módulo Cargas – CRUD completo + Sortear Carga (escolhe transportador/veículo aleatório)
 */
export default function CargasPage() {
  const {
    cargas,
    veiculos,
    addCarga,
    updateCarga,
    removeCarga,
    getVeiculo,
    getTransportadoresDisponiveis,
    getVeiculosDisponiveis,
    updateVeiculo,
  } = useLogisticaStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c: Carga) => {
    setEditingId(c.id);
    setForm({
      produto: c.produto,
      quantidade: c.quantidade,
      peso: c.peso,
      origem: c.origem,
      destino: c.destino,
      status: c.status,
      dataCarregamento: c.dataCarregamento.slice(0, 10),
      dataEntregaPrevista: c.dataEntregaPrevista.slice(0, 10),
      veiculoId: c.veiculoId,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.produto.trim()) {
      toast.error("O produto é obrigatório");
      return;
    }
    const payload = {
      ...form,
      dataCarregamento: new Date(form.dataCarregamento).toISOString(),
      dataEntregaPrevista: new Date(form.dataEntregaPrevista).toISOString(),
    };
    if (editingId) {
      updateCarga(editingId, payload);
      toast.success("Carga atualizada com sucesso!");
    } else {
      addCarga(payload);
      toast.success("Carga cadastrada com sucesso!");
    }
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handleDelete = (id: string, produto: string) => {
    toast("Excluir carga?", {
      description: `Tem certeza que deseja excluir a carga ${produto}?`,
      action: {
        label: "Excluir",
        onClick: () => {
          removeCarga(id);
          toast.success("Carga excluída");
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => { },
      },
    });
  };

  /** Sortear Carga: escolhe aleatoriamente um transportador disponível e um veículo */
  const sortearCarga = (cargaId: string) => {
    const disponiveis = getVeiculosDisponiveis();
    if (disponiveis.length === 0) {
      toast.error("Nenhum veículo disponível no momento.");
      return;
    }
    const veiculo = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    updateCarga(cargaId, {
      veiculoId: veiculo.id,
      status: "em transporte",
    });
    updateVeiculo(veiculo.id, { status: "em rota" });
    toast.success(`Veículo ${veiculo.placa} sorteado e carga enviada para transporte!`);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Cargas</h2>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Nova carga
          </button>
        </div>

        <Card delay={0.1} className="!p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Nenhuma carga cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                cargas.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{c.produto}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">{c.quantidade}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">{c.peso} kg</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">{c.origem}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">{c.destino}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[c.status]}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">
                      {c.veiculoId ? getVeiculo(c.veiculoId)?.placa ?? "-" : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 inline-flex items-center">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                          aria-label="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.produto)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                          aria-label="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {c.status === "aguardando" && (
                          <button
                            type="button"
                            onClick={() => sortearCarga(c.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 ml-2 text-xs font-semibold bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg hover:bg-emerald-200/50 dark:hover:bg-emerald-500/20 transition-colors border border-emerald-200/50 dark:border-emerald-500/20"
                            title="Sortear carga (transportador/veículo aleatório)"
                          >
                            <Shuffle className="w-3.5 h-3.5" />
                            Sortear
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? "Editar carga" : "Nova carga"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produto
              </label>
              <input
                type="text"
                value={form.produto}
                onChange={(e) =>
                  setForm((f) => ({ ...f, produto: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.quantidade || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      quantidade: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.peso || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, peso: Number(e.target.value) || 0 }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origem
              </label>
              <input
                type="text"
                value={form.origem}
                onChange={(e) =>
                  setForm((f) => ({ ...f, origem: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino
              </label>
              <input
                type="text"
                value={form.destino}
                onChange={(e) =>
                  setForm((f) => ({ ...f, destino: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data carregamento
                </label>
                <input
                  type="date"
                  value={form.dataCarregamento}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      dataCarregamento: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Previsão entrega
                </label>
                <input
                  type="date"
                  value={form.dataEntregaPrevista}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      dataEntregaPrevista: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as StatusCarga,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="aguardando">Aguardando</option>
                <option value="carregado">Carregado</option>
                <option value="em transporte">Em transporte</option>
                <option value="entregue">Entregue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Veículo
              </label>
              <select
                value={form.veiculoId ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    veiculoId: e.target.value || null,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Nenhum</option>
                {veiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} – {v.modelo}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 flex items-center justify-center text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
              >
                {editingId ? "Salvar alterações" : "Cadastrar"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}
