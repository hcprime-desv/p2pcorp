import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listarConteudo } from "@/lib/data";
import DetalheSolucao from "@/components/paginas/DetalheSolucao";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = (await listarConteudo()).solucoes.find((x) => x.slug === slug);
  return { title: s?.nome ?? "Solução", description: s?.resumo || undefined };
}

export default async function SolucaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await listarConteudo()).solucoes.some((s) => s.slug === slug)) notFound();
  return <DetalheSolucao slug={slug} />;
}
