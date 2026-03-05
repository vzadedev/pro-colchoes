import Link from "next/link";

/**
 * Next.js App Router: este arquivo é exibido quando nenhuma rota
 * corresponde à URL (404). Evita que o usuário veja uma página
 * genérica e orienta de volta ao app.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-600 mb-6 text-center">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
