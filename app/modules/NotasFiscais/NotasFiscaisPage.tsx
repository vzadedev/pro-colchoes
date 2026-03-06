"use client";

import { useState } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import type { NotaFiscal } from "../../types";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import PageTransition from "../../components/ui/PageTransition";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
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

        <Card delay={0.1} className="!p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Nota</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>ICMS</TableHead>
                <TableHead>CFOP</TableHead>
                <TableHead>CNPJ Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notasFiscais.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhuma nota fiscal cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                notasFiscais.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                      {n.numeroNota}
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">
                      R$ {n.valor.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">R$ {n.icms.toFixed(2)}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">{n.cfop}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 font-mono text-sm">
                      {n.cnpjCliente}
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 capitalize">
                      {n.status}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 inline-flex items-center">
                        <button
                          type="button"
                          onClick={() => openEdit(n)}
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                          aria-label="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(n.id, n.numeroNota)}
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
