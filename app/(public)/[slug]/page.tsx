import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listarConteudo } from "@/lib/data";
import PaginaDinamica from "@/components/paginas/PaginaDinamica";

// Qualquer página criada no admSite (Site → Páginas): /{slug}. "contato"
// existe mesmo sem página cadastrada (formulário padrão).
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = (await listarConteudo()).paginas.find((x) => x.slug === slug);
  return { title: p?.titulo ?? (slug === "contato" ? "Contato" : "Página"), description: p?.seoDescricao || p?.resumo || undefined };
}

export default async function Pagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await listarConteudo();
  if (!c.paginas.some((p) => p.slug === slug) && slug !== "contato") notFound();
  return <PaginaDinamica slug={slug} />;
}
