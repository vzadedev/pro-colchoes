"use client";

import { useState } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import PageTransition from "../../components/ui/PageTransition";
import { Star, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

/**
 * Módulo Avaliações – avaliar transportadores (nota 1–5 + comentário);
 * a média é atualizada automaticamente no store
 */
export default function AvaliacoesPage() {
  const {
    transportadores,
    entregas,
    addAvaliacao,
    getAvaliacoesByTransportador,
  } = useLogisticaStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [transportadorId, setTransportadorId] = useState("");
  const [nota, setNota] = useState(3);
  const [comentario, setComentario] = useState("");

  const entregasConcluidas = entregas.filter((e) => e.status === "concluída");
  const podeAvaliar = transportadores.length > 0;

  const openAvaliar = (tid: string) => {
    setTransportadorId(tid);
    setNota(3);
    setComentario("");
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transportadorId) {
      toast.error("Processo inválido: Transportador não encontrado.");
      return;
    }

    addAvaliacao({
      transportadorId,
      nota,
      comentario,
    });

    toast.success("Avaliação enviada com sucesso!");
    setModalOpen(false);
    setTransportadorId("");
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Avaliação de Motoristas
        </h2>
        <p className="text-gray-600">
          Avalie os transportadores após a entrega. A média é atualizada
          automaticamente.
        </p>

        <Card title="Avaliar transportador" delay={0.1}>
          {!podeAvaliar ? (
            <p className="text-gray-500">
              Cadastre transportadores e conclua entregas para habilitar
              avaliações.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-600 text-sm bg-gray-50/50">
                    <th className="py-3 px-4 font-medium rounded-tl-lg">Transportador</th>
                    <th className="py-3 font-medium">Empresa</th>
                    <th className="py-3 font-medium">Avaliação média</th>
                    <th className="py-3 font-medium">Total avaliações</th>
                    <th className="py-3 font-medium w-28 rounded-tr-lg">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {transportadores.map((t) => {
                    const avals = getAvaliacoesByTransportador(t.id);
                    return (
                      <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {t.nome}
                        </td>
                        <td className="py-3 text-gray-600">{t.empresa}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            {t.avaliacaoMedia > 0
                              ? t.avaliacaoMedia.toFixed(1)
                              : "-"}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600">{avals.length}</td>
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() => openAvaliar(t.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium border border-amber-100"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Avaliar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Avaliar transportador"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nota (1 a 5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNota(n)}
                    className={`p-2 rounded-lg border-2 transition-colors ${nota === n
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${nota >= n ? "fill-amber-500 text-amber-500" : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentário (opcional)
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                rows={3}
                placeholder="Descreva sua experiência..."
              />
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
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium shadow-sm"
              >
                Enviar avaliação
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}
