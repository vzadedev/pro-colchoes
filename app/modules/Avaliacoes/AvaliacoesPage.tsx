"use client";

import { useState } from "react";
import { useLogisticaStore } from "../../store/useLogisticaStore";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import PageTransition from "../../components/ui/PageTransition";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Avaliação de Motoristas
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Avalie os transportadores após a entrega. A média é atualizada
          automaticamente.
        </p>

        <Card title="Avaliar transportador" delay={0.1} className="!p-0 overflow-hidden">
          {!podeAvaliar ? (
            <div className="p-4 text-slate-500">
              Cadastre transportadores e conclua entregas para habilitar
              avaliações.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transportador</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Avaliação média</TableHead>
                  <TableHead>Total avaliações</TableHead>
                  <TableHead className="w-[120px] text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportadores.map((t) => {
                  const avals = getAvaliacoesByTransportador(t.id);
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                        {t.nome}
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400">{t.empresa}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-500 bg-amber-50/50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md text-xs border border-amber-200/50 dark:border-amber-500/20">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {t.avaliacaoMedia > 0
                            ? t.avaliacaoMedia.toFixed(1)
                            : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400">{avals.length}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => openAvaliar(t.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-100/80 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 rounded-lg hover:bg-amber-200/50 dark:hover:bg-amber-500/20 transition-colors border border-amber-200/50 dark:border-amber-500/20"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Avaliar
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
