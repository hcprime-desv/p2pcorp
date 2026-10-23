import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listarConteudo } from "@/lib/data";
import DetalheNoticia from "@/components/paginas/DetalheNoticia";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = (await listarConteudo()).noticias.find((x) => x.slug === slug);
  return { title: n?.titulo ?? "Notícia", description: n?.resumo || undefined };
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await listarConteudo()).noticias.some((n) => n.slug === slug)) notFound();
  return <DetalheNoticia slug={slug} />;
}
