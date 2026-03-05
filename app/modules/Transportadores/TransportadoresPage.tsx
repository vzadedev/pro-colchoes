"use client";

import { useState } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import type { Transportador } from "../../types";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import PageTransition from "../../components/ui/PageTransition";
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

        <Card delay={0.1}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-600 text-sm bg-gray-50/50">
                  <th className="py-3 px-4 font-medium rounded-tl-lg">Nome</th>
                  <th className="py-3 font-medium">CPF/CNPJ</th>
                  <th className="py-3 font-medium">Telefone</th>
                  <th className="py-3 font-medium">Email</th>
                  <th className="py-3 font-medium">Empresa</th>
                  <th className="py-3 font-medium">Avaliação</th>
                  <th className="py-3 font-medium w-24 rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody>
                {transportadores.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      Nenhum transportador cadastrado.
                    </td>
                  </tr>
                ) : (
                  transportadores.map((t) => (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{t.nome}</td>
                      <td className="py-3 text-gray-600">{t.cpfOuCnpj}</td>
                      <td className="py-3 text-gray-600">{t.telefone}</td>
                      <td className="py-3 text-gray-600">{t.email}</td>
                      <td className="py-3 text-gray-600">{t.empresa}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-sm font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {t.avaliacaoMedia > 0 ? t.avaliacaoMedia.toFixed(1) : "-"}
                        </span>
                      </td>
                      <td className="py-3 flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          aria-label="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id, t.nome)}
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
