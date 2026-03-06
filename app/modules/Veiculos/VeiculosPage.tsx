"use client";

import { useState } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import type { Veiculo, TipoVeiculo, StatusVeiculo } from "../../types";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import Badge, { variants } from "../../components/ui/Badge";
import PageTransition from "../../components/ui/PageTransition";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyForm = {
  placa: "",
  modelo: "",
  tipo: "caminhão" as TipoVeiculo,
  capacidadeCarga: 0,
  transportadorId: "",
  status: "disponível" as StatusVeiculo,
};

const statusVariant: Record<StatusVeiculo, keyof typeof variants> = {
  disponível: "success",
  "em rota": "warning",
  manutenção: "danger",
};

/**
 * Módulo Veículos – CRUD completo em memória
 */
export default function VeiculosPage() {
  const {
    veiculos,
    transportadores,
    addVeiculo,
    updateVeiculo,
    removeVeiculo,
    getTransportador,
  } = useLogisticaStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, transportadorId: transportadores[0]?.id ?? "" });
    setModalOpen(true);
  };

  const openEdit = (v: Veiculo) => {
    setEditingId(v.id);
    setForm({
      placa: v.placa,
      modelo: v.modelo,
      tipo: v.tipo,
      capacidadeCarga: v.capacidadeCarga,
      transportadorId: v.transportadorId,
      status: v.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.placa.trim()) {
      toast.error("A placa é obrigatória");
      return;
    }
    if (editingId) {
      updateVeiculo(editingId, form);
      toast.success("Veículo atualizado com sucesso!");
    } else {
      addVeiculo(form);
      toast.success("Veículo cadastrado com sucesso!");
    }
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handleDelete = (id: string, placa: string) => {
    toast("Excluir veículo?", {
      description: `Tem certeza que deseja excluir o veículo ${placa}?`,
      action: {
        label: "Excluir",
        onClick: () => {
          removeVeiculo(id);
          toast.success("Veículo excluído");
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => { },
      },
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Veículos</h2>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Cadastrar veículo
          </button>
        </div>

        <Card delay={0.1} className="!p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Capacidade (kg)</TableHead>
                <TableHead>Transportador</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhum veículo cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                veiculos.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{v.placa}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">{v.modelo}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 capitalize">{v.tipo}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">{v.capacidadeCarga}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">
                      {getTransportador(v.transportadorId)?.nome ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[v.status]}>
                        {v.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 inline-flex items-center">
                        <button
                          type="button"
                          onClick={() => openEdit(v)}
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                          aria-label="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(v.id, v.placa)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                          aria-label="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
          title={editingId ? "Editar veículo" : "Cadastrar veículo"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa
              </label>
              <input
                type="text"
                value={form.placa}
                onChange={(e) => setForm((f) => ({ ...f, placa: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <input
                type="text"
                value={form.modelo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, modelo: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={form.tipo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tipo: e.target.value as TipoVeiculo }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="caminhão">Caminhão</option>
                <option value="carreta">Carreta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidade de carga (kg)
              </label>
              <input
                type="number"
                min={0}
                value={form.capacidadeCarga || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    capacidadeCarga: Number(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
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
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as StatusVeiculo,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="disponível">Disponível</option>
                <option value="em rota">Em rota</option>
                <option value="manutenção">Manutenção</option>
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
