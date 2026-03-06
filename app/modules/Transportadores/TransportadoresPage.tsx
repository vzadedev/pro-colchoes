"use client";

import { useState } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import type { Transportador } from "../../types";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import PageTransition from "../../components/ui/PageTransition";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

const emptyForm = {
  nome: "",
  cpfOuCnpj: "",
  telefone: "",
  email: "",
  empresa: "",
};

/**
 * Módulo Transportadores – CRUD completo em memória
 */
export default function TransportadoresPage() {
  const {
    transportadores,
    addTransportador,
    updateTransportador,
    removeTransportador,
  } = useLogisticaStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (t: Transportador) => {
    setEditingId(t.id);
    setForm({
      nome: t.nome,
      cpfOuCnpj: t.cpfOuCnpj,
      telefone: t.telefone,
      email: t.email,
      empresa: t.empresa,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      toast.error("O nome é obrigatório");
      return;
    }
    if (editingId) {
      updateTransportador(editingId, form);
      toast.success("Transportador atualizado com sucesso!");
    } else {
      addTransportador(form);
      toast.success("Transportador cadastrado com sucesso!");
    }
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handleDelete = (id: string, nome: string) => {
    toast("Excluir transportador?", {
      description: `Tem certeza que deseja excluir ${nome}?`,
      action: {
        label: "Excluir",
        onClick: () => {
          removeTransportador(id);
          toast.success("Transportador excluído");
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => console.log("Cancelado"),
      },
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Transportadores</h2>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Cadastrar transportador
          </button>
        </div>

        <Card delay={0.1} className="!p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transportadores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhum transportador cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                transportadores.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{t.nome}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">{t.cpfOuCnpj}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">{t.telefone}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">{t.email}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400">{t.empresa}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 px-2.5 py-1 rounded-md text-xs font-semibold border border-amber-200/50 dark:border-amber-500/20">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {t.avaliacaoMedia > 0 ? t.avaliacaoMedia.toFixed(1) : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                          aria-label="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id, t.nome)}
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
          title={editingId ? "Editar transportador" : "Cadastrar transportador"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF ou CNPJ
              </label>
              <input
                type="text"
                value={form.cpfOuCnpj}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cpfOuCnpj: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={form.telefone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, telefone: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <input
                type="text"
                value={form.empresa}
                onChange={(e) =>
                  setForm((f) => ({ ...f, empresa: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
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
