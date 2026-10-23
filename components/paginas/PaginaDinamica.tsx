"use client";

// Página do admSite (Site → Páginas): cabeçalho (título, resumo, banner),
// o conteúdo em Markdown e, depois, as SEÇÕES cadastradas para o slug dela.
// Layout do ViaMob360 (.pagina-cab / .pagina-corpo / .markdown-body).
// Tudo ao vivo: editou no admSite, muda aqui sem recarregar.
import { useConteudo } from "@/components/public/AoVivo";
import Markdown from "@/components/public/Markdown";
import Secoes, { Contato } from "@/components/secoes/Secoes";
import type { Secao } from "@/types/conteudo";

export function CabecalhoPagina({ titulo, resumo, imagemUrl, chamada, children }: {
  titulo: string; resumo?: string; imagemUrl?: string | null; chamada?: string; children?: React.ReactNode;
}) {
  return (
    <section className={`pagina-cab${imagemUrl ? " com-imagem" : ""}`} style={imagemUrl ? ({ ["--cab-img" as any]: `url('${imagemUrl}')` } as React.CSSProperties) : undefined}>
      <div className="container">
        {chamada && <div className="eyebrow">{chamada}</div>}
        {titulo && <h1>{titulo}</h1>}
        {resumo && <p>{resumo}</p>}
        {children}
      </div>
    </section>
  );
}

const CONTATO_PADRAO: Secao = {
  id: "contato-padrao", pagina: "contato", tipo: "contato", ancora: "", chamada: "", titulo: "Fale com a gente", tituloDestaque: "", texto: "",
  itens: "", imagemUrl: null, imagemLado: "direita", botaoTexto: "", botaoLink: "", botao2Texto: "", botao2Link: "", fundo: "claro", ordem: 1,
};

export default function PaginaDinamica({ slug }: { slug: string }) {
  const { paginas, secoes } = useConteudo();
  const p = paginas.find((x) => x.slug === slug);
  if (!p) {
    if (slug === "contato") return (<><CabecalhoPagina titulo="Contato" /><Contato s={CONTATO_PADRAO} /></>);
    return <div className="container vazio">Esta página não está mais publicada.</div>;
  }
  const temSecoes = secoes.some((s) => s.pagina === slug);
  return (
    <>
      <CabecalhoPagina titulo={p.titulo} resumo={p.resumo} />
      {(p.conteudo || p.imagemUrl) && (
        <section className="section pagina-corpo">
          <div className="container estreito">
            {p.imagemUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imagemUrl} alt="" className="pagina-img" />
            )}
            <div className="markdown-body"><Markdown>{p.conteudo}</Markdown></div>
          </div>
        </section>
      )}
      {temSecoes ? <Secoes pagina={slug} /> : !p.conteudo && slug === "contato" ? <Contato s={CONTATO_PADRAO} /> : null}
    </>
  );
}
