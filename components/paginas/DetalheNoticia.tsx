"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useConteudo } from "@/components/public/AoVivo";
import Markdown from "@/components/public/Markdown";
import { CartaoNoticia, dataBr } from "@/components/secoes/Secoes";
import { CabecalhoPagina } from "./PaginaDinamica";

// /noticias/{slug} — ao vivo (editou no admSite, muda aqui). Layout do ViaMob360.
export default function DetalheNoticia({ slug }: { slug: string }) {
  const { noticias } = useConteudo();
  const n = noticias.find((x) => x.slug === slug);
  if (!n) return <div className="container vazio">Esta notícia não está mais publicada.</div>;
  const outras = noticias.filter((x) => x.slug !== slug).slice(0, 3);
  return (
    <>
      <CabecalhoPagina chamada={[dataBr(n.data), n.categoria].filter(Boolean).join(" • ")} titulo={n.titulo} resumo={n.resumo} />
      <section className="section pagina-corpo">
        <div className="container estreito">
          <Link href="/noticias" className="voltar"><ArrowLeft size={16} /> Todas as notícias</Link>
          {n.imagemUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={n.imagemUrl} alt="" className="pagina-img" />
          )}
          <div className="markdown-body"><Markdown>{n.conteudo}</Markdown></div>
        </div>
      </section>
      {outras.length > 0 && (
        <section className="section soft">
          <div className="container">
            <div className="section-head"><div><h2>Leia também</h2></div></div>
            <div className="grade-noticias">{outras.map((x) => <CartaoNoticia key={x.id} n={x} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
