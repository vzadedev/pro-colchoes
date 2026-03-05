"use client";

import { useState } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import type { Entrega, StatusEntrega } from "../../types";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Badge, { variants } from "../../components/ui/Badge";
import PageTransition from "../../components/ui/PageTransition";
import { Plus, CheckCircle, AlertTriangle, RotateCcw, Pencil } from "lucide-react";
import { toast } from "sonner";

const statusVariant: Record<StatusEntrega, keyof typeof variants> = {
  pendente: "neutral",
  "em rota": "warning",
  concluída: "success",
  avaria: "danger",
  devolução: "danger",
};

const emptyForm = {
  transportadorId: "",
  veiculoId: "",
  cargaId: "",
  status: "pendente" as StatusEntrega,
  dataEntrega: null as string | null,
  temAvaria: false,
  descricaoAvaria: "",
};

/**
 * Módulo Entregas – listar entregas; registrar conclusão, avaria e devolução
 */
export default function EntregasPage() {
  const {
    entregas,
    transportadores,
    veiculos,
    cargas,
    addEntrega,
    updateEntrega,
    getTransportador,
    getVeiculo,
    getCarga,
    getEntrega,
    updateCarga,
    updateVeiculo,
  } = useLogisticaStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      transportadorId: transportadores[0]?.id ?? "",
      veiculoId: veiculos[0]?.id ?? "",
      cargaId: cargas[0]?.id ?? "",
    });
    setModalOpen(true);
  };

  const openEdit = (e: Entrega) => {
    setEditingId(e.id);
    setForm({
      transportadorId: e.transportadorId,
      veiculoId: e.veiculoId,
      cargaId: e.cargaId,
      status: e.status,
      dataEntrega: e.dataEntrega,
      temAvaria: e.temAvaria,
      descricaoAvaria: e.descricaoAvaria,
    });
    setEditModalOpen(true);
  };

  const handleSubmitNew = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.cargaId || !form.veiculoId || !form.transportadorId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    addEntrega({
      transportadorId: form.transportadorId,
      veiculoId: form.veiculoId,
      cargaId: form.cargaId,
      status: form.status,
      dataEntrega: form.dataEntrega,
      temAvaria: form.temAvaria,
      descricaoAvaria: form.descricaoAvaria,
    });
    toast.success("Nova entrega cadastrada com sucesso!");
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handleSubmitEdit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editingId) return;
    updateEntrega(editingId, {
      status: form.status,
      dataEntrega: form.dataEntrega,
      temAvaria: form.temAvaria,
      descricaoAvaria: form.descricaoAvaria,
    });
    if (form.status === "concluída") {
      const carga = getCarga(form.cargaId);
      if (carga) updateCarga(carga.id, { status: "entregue" });
      const veiculo = getVeiculo(form.veiculoId);
      if (veiculo) updateVeiculo(veiculo.id, { status: "disponível" });
    }
    toast.success("Entrega atualizada!");
    setEditModalOpen(false);
    setEditingId(null);
  };

  const marcarConcluida = (id: string, produtoNome: string) => {
    toast(`Concluir entrega?`, {
      description: `Confirmar entrega concluída para a carga ${produtoNome}?`,
      action: {
        label: "Confirmar",
        onClick: () => {
          const data = new Date().toISOString();
          updateEntrega(id, { status: "concluída", dataEntrega: data, temAvaria: false, descricaoAvaria: "" });
          const entrega = getEntrega(id);
          if (entrega) {
            updateCarga(entrega.cargaId, { status: "entregue" });
            updateVeiculo(entrega.veiculoId, { status: "disponível" });
          }
          toast.success("Entrega marcada como concluída!");
        }
      },
      cancel: { label: "Cancelar", onClick: () => { } }
    });
  };

  const marcarAvaria = (id: string) => {
    const desc = prompt("Descreva a avaria:");
    if (desc == null) return;
    updateEntrega(id, {
      status: "avaria",
      temAvaria: true,
      descricaoAvaria: desc,
      dataEntrega: new Date().toISOString(),
    });
    toast.warning("Avaria registrada na entrega!");
  };

  const marcarDevolucao = (id: string) => {
    toast("Registrar devolução?", {
      description: "Confirma a devolução desta carga?",
      action: {
        label: "Confirmar",
        onClick: () => {
          updateEntrega(id, {
            status: "devolução",
            dataEntrega: new Date().toISOString(),
          });
          toast.error("Entrega marcada como devolução");
        }
      },
      cancel: { label: "Cancelar", onClick: () => { } }
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Entregas</h2>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Nova entrega
          </button>
        </div>

        <Card delay={0.1}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-600 text-sm bg-gray-50/50">
                  <th className="py-3 px-4 font-medium rounded-tl-lg">Transportador</th>
                  <th className="py-3 font-medium">Veículo</th>
                  <th className="py-3 font-medium">Carga</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Data entrega</th>
                  <th className="py-3 font-medium">Avaria</th>
                  <th className="py-3 font-medium w-40 rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody>
                {entregas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      Nenhuma entrega registrada.
                    </td>
                  </tr>
                ) : (
                  entregas.map((e) => {
                    const cargaNome = getCarga(e.cargaId)?.produto ?? "-";
                    return (
                      <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-medium">
                          {getTransportador(e.transportadorId)?.nome ?? "-"}
                        </td>
                        <td className="py-3 text-gray-600">
                          {getVeiculo(e.veiculoId)?.placa ?? "-"}
                        </td>
                        <td className="py-3 text-gray-600">
                          {cargaNome}
                        </td>
                        <td className="py-3">
                          <Badge variant={statusVariant[e.status]}>
                            {e.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-gray-600 text-sm">
                          {e.dataEntrega
                            ? new Date(e.dataEntrega).toLocaleString("pt-BR")
                            : "-"}
                        </td>
                        <td className="py-3 text-gray-600">
                          {e.temAvaria ? (
                            <span className="text-red-600 text-sm font-medium">
                              {e.descricaoAvaria || "Sim"}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-3 flex gap-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => openEdit(e)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                            aria-label="Editar"
                            title="Editar entrega"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {e.status !== "concluída" && e.status !== "avaria" && e.status !== "devolução" && (
                            <>
                              <button
                                type="button"
                                onClick={() => marcarConcluida(e.id, cargaNome)}
                                className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                                title="Marcar como Concluída"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => marcarAvaria(e.id)}
                                className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-md transition-colors"
                                title="Registrar Avaria"
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => marcarDevolucao(e.id)}
                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                title="Registrar Devolução"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Nova entrega"
        >
          <form onSubmit={handleSubmitNew} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transportador
              </label>
              <select
                value={form.transportadorId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, transportadorId: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              >
                <option value="">Selecione</option>
                {transportadores.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Veículo
              </label>
              <select
                value={form.veiculoId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, veiculoId: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              >
                <option value="">Selecione</option>
                {veiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} – {v.modelo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carga
              </label>
              <select
                value={form.cargaId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cargaId: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              >
                <option value="">Selecione</option>
                {cargas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.produto} – {c.destino}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Editar entrega"
        >
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as StatusEntrega }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="pendente">Pendente</option>
                <option value="em rota">Em rota</option>
                <option value="concluída">Concluída</option>
                <option value="avaria">Avaria</option>
                <option value="devolução">Devolução</option>
              </select>
            </div>
            {form.status === "concluída" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data entrega
                </label>
                <input
                  type="datetime-local"
                  value={
                    form.dataEntrega
                      ? form.dataEntrega.slice(0, 16)
                      : new Date().toISOString().slice(0, 16)
                  }
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      dataEntrega: e.target.value ? new Date(e.target.value).toISOString() : null,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            )}
            <div className="flex items-center gap-2 mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <input
                type="checkbox"
                id="temAvaria"
                checked={form.temAvaria}
                onChange={(e) =>
                  setForm((f) => ({ ...f, temAvaria: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="temAvaria" className="text-sm font-medium text-gray-700 cursor-pointer">
                Registrar avaria nesta entrega
              </label>
            </div>
            {form.temAvaria && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição detalhada da avaria
                </label>
                <textarea
                  value={form.descricaoAvaria}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, descricaoAvaria: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all bg-red-50/30"
                  rows={3}
                  placeholder="Ex: Embalagem violada, produto amassado..."
                />
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
              >
                Salvar alterações
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}
