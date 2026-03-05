"use client";

import { useState } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import type { NotaFiscal } from "../../types";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import PageTransition from "../../components/ui/PageTransition";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyForm = {
  numeroNota: "",
  valor: 0,
  icms: 0,
  cfop: "",
  cnpjCliente: "",
  enderecoEntrega: "",
  status: "pendente",
};

/**
 * Validação básica simulada: CNPJ 14 dígitos, valor > 0
 */
function validarNota(form: typeof emptyForm): string | null {
  const cnpj = form.cnpjCliente.replace(/\D/g, "");
  if (cnpj.length !== 14) return "CNPJ deve ter 14 dígitos.";
  if (form.valor <= 0) return "Valor deve ser maior que zero.";
  if (!form.numeroNota.trim()) return "Número da nota é obrigatório.";
  return null;
}

/**
 * Módulo Notas Fiscais – CRUD com validação básica simulada
 */
export default function NotasFiscaisPage() {
  const {
    notasFiscais,
    addNotaFiscal,
    updateNotaFiscal,
    removeNotaFiscal,
  } = useLogisticaStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (n: NotaFiscal) => {
    setEditingId(n.id);
    setForm({
      numeroNota: n.numeroNota,
      valor: n.valor,
      icms: n.icms,
      cfop: n.cfop,
      cnpjCliente: n.cnpjCliente,
      enderecoEntrega: n.enderecoEntrega,
      status: n.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validarNota(form);
    if (msg) {
      toast.error(msg);
      return;
    }
    if (editingId) {
      updateNotaFiscal(editingId, form);
      toast.success("Nota fiscal atualizada com sucesso!");
    } else {
      addNotaFiscal(form);
      toast.success("Nota fiscal cadastrada com sucesso!");
    }
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handleDelete = (id: string, numero: string) => {
    toast("Excluir nota fiscal?", {
      description: `Tem certeza que deseja excluir a nota ${numero}?`,
      action: {
        label: "Excluir",
        onClick: () => {
          removeNotaFiscal(id);
          toast.success("Nota fiscal excluída");
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
          <h2 className="text-2xl font-bold text-gray-900">Notas Fiscais</h2>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Nova nota fiscal
          </button>
        </div>

        <Card delay={0.1}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-600 text-sm bg-gray-50/50">
                  <th className="py-3 px-4 font-medium rounded-tl-lg">Nº Nota</th>
                  <th className="py-3 font-medium">Valor</th>
                  <th className="py-3 font-medium">ICMS</th>
                  <th className="py-3 font-medium">CFOP</th>
                  <th className="py-3 font-medium">CNPJ Cliente</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium w-24 rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody>
                {notasFiscais.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      Nenhuma nota fiscal cadastrada.
                    </td>
                  </tr>
                ) : (
                  notasFiscais.map((n) => (
                    <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {n.numeroNota}
                      </td>
                      <td className="py-3 text-gray-600">
                        R$ {n.valor.toLocaleString("pt-BR")}
                      </td>
                      <td className="py-3 text-gray-600">R$ {n.icms.toFixed(2)}</td>
                      <td className="py-3 text-gray-600">{n.cfop}</td>
                      <td className="py-3 text-gray-600 font-mono text-sm">
                        {n.cnpjCliente}
                      </td>
                      <td className="py-3 text-gray-600 capitalize">{n.status}</td>
                      <td className="py-3 flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(n)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          aria-label="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(n.id, n.numeroNota)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          aria-label="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? "Editar nota fiscal" : "Nova nota fiscal"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número da nota
              </label>
              <input
                type="text"
                value={form.numeroNota}
                onChange={(e) =>
                  setForm((f) => ({ ...f, numeroNota: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step={0.01}
                  min={0}
                  value={form.valor || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, valor: Number(e.target.value) || 0 }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ICMS (R$)
                </label>
                <input
                  type="number"
                  step={0.01}
                  min={0}
                  value={form.icms || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, icms: Number(e.target.value) || 0 }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CFOP
              </label>
              <input
                type="text"
                value={form.cfop}
                onChange={(e) => setForm((f) => ({ ...f, cfop: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CNPJ do cliente (14 dígitos)
              </label>
              <input
                type="text"
                value={form.cnpjCliente}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cnpjCliente: e.target.value }))
                }
                placeholder="00000000000000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                maxLength={18}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço de entrega
              </label>
              <input
                type="text"
                value={form.enderecoEntrega}
                onChange={(e) =>
                  setForm((f) => ({ ...f, enderecoEntrega: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="pendente">Pendente</option>
                <option value="emitida">Emitida</option>
                <option value="cancelada">Cancelada</option>
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
